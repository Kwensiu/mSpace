<script>
	import { onMount } from 'svelte';

	export let entries = [];

	let expandedImages = new Set();
	let contentCache = new Map();
	let isMounted = false;
	let contentReady = false;

	onMount(() => {
		isMounted = true;

		setTimeout(() => {
			entries.forEach((entry) => {
				getCachedContent(entry.id);
			});
			contentReady = true;

			// 预触发布局计算,消除首次动画卡顿
			requestAnimationFrame(() => {
				entries.forEach((entry) => {
					const card = document.querySelector(`[data-entry-id="${entry.id}"]`);
					if (card) {
						forceLayoutComputation(card);
					}
				});
			});
		}, 100);
	});

	const getCachedContent = (entryId) => {
		if (!isMounted) return '';

		if (contentCache.has(entryId)) {
			return contentCache.get(entryId);
		}

		const template = document.querySelector(
			`#gallery-content-templates [data-gallery-id="${entryId}"]`,
		);

		let html = '';
		if (template) {
			const proseDiv = template.querySelector('.prose');
			html = proseDiv ? proseDiv.outerHTML : template.innerHTML;
		}

		contentCache.set(entryId, html);
		return html;
	};

	const forceLayoutComputation = (element) => {
		// 强制浏览器计算布局
		element.offsetHeight;
		element.clientWidth;
	};

	const toggleImage = (entry) => {
		if (expandedImages.has(entry.id)) {
			expandedImages.delete(entry.id);
		} else {
			expandedImages.add(entry.id);
		}
		expandedImages = new Set(expandedImages);
	};

	const handleKey = (event, entry) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleImage(entry);
		}
	};
</script>

<div class="interactive-gallery">
	{#each entries as entry (entry.id)}
		<div class="w-full mb-4 overflow-hidden">
			<div class="gallery-card postpage-post relative rounded-2xl overflow-hidden transition-all duration-300 ease w-full bg-[rgb(245,245,245)] dark:bg-[rgb(60,60,65)] {expandedImages.has(entry.id) ? 'expanded' : ''}" data-entry-id={entry.id}>
				<div
					class="gallery-image-wrapper relative z-10 cursor-pointer block overflow-hidden"
					on:click={() => toggleImage(entry)}
					on:keydown={(e) => handleKey(e, entry)}
					role="button"
					tabindex="0"
					aria-label="点击展开图片详情"
				>
					<img
						src={entry.data.image}
						alt={entry.data.title}
						class="gallery-image w-full h-auto object-cover block transition-transform duration-gallery ease-gallery"
						loading="lazy"
					/>
					{#if entry.data.logo}
						<div class="logo-overlay absolute bottom-2 left-1/2 z-20 rounded-lg p-1 transition-opacity duration-gallery ease-gallery {expandedImages.has(entry.id) ? 'opacity-0' : 'opacity-30'}" style="transform: translateX(-50%);">
							<img
								src={entry.data.logo}
								alt="Logo"
								class="logo-image max-w-[80px] object-contain block"
							/>
						</div>
					{/if}
				</div>

				<div class="article-content-wrapper relative z-10 grid grid-rows-[0fr] transition-[grid-template-rows] duration-gallery ease-gallery {expandedImages.has(entry.id) ? 'grid-rows-[1fr]' : ''}">
					<div class="article-content min-h-0 p-0 overflow-hidden transition-[opacity,padding] duration-gallery ease-gallery {expandedImages.has(entry.id) ? 'opacity-100 p-4 md:p-6' : 'opacity-0'}">
						<div class="h-px bg-[#e0e0e0] mx-4 mb-4"></div>
						<div class="flex justify-between items-start mx-2 mb-1">
							<h3 class="text-2xl font-semibold dark:text-neutral-50 transition">{entry.data.title}</h3>
							{#if entry.data.location}
								<div class="details-location inline-flex items-center px-3 py-1.5 bg-[#dbeafe] text-[#98def0] rounded-full text-sm dark:bg-[#1e3a8a] dark:text-[#93c5fd]">
									<span>📍 {entry.data.location}</span>
								</div>
							{/if}
						</div>
						<p class="text-lg mx-2 text-slate-600 dark:text-slate-400">{entry.data.description}</p>

						{#if contentReady}
							{@html getCachedContent(entry.id)}
						{:else}
							<div class="loading-placeholder"></div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.gallery-image {
		transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
		will-change: transform;
	}

	.gallery-card:not(.expanded) .gallery-image {
		transform: scale(1);
	}

	.gallery-card.expanded .gallery-image {
		transform: scale(0.9);
	}

	.article-content-wrapper {
		will-change: grid-template-rows;
	}

	@media (max-width: 768px) {
		.gallery-image-wrapper,
		.logo-overlay,
		.article-content-wrapper {
			transform: translateZ(0);
			will-change: transform, grid-template-rows;
		}

		.logo-overlay {
			transform: translateX(-50%) !important;
		}
	}
</style>