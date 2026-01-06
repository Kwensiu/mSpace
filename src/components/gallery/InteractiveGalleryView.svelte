<script>
  export let entries = [];
  export const renderedContents = new Map();

  let expandedImages = new Set();

  const toggleImage = (entry) => {
    if (expandedImages.has(entry.id)) {
      expandedImages.delete(entry.id);
    } else {
      expandedImages.add(entry.id);
    }
    expandedImages = new Set(expandedImages);
  };
  
  // 键盘事件处理函数
  const handleKey = (event, entry) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleImage(entry);
    }
  };
</script>

<div class="interactive-gallery">
  {#each entries as entry (entry.id)}
    <div class="w-full mb-4 max-h-[5000px] overflow-hidden">
      <div class="gallery-card postpage-post relative rounded-2xl overflow-hidden transition-all duration-300 ease w-full bg-[rgb(245,245,245)] dark:bg-[rgb(60,60,65)] {expandedImages.has(entry.id) ? 'expanded' : ''}">
        <div
          class="gallery-image-wrapper relative z-10 cursor-pointer block overflow-hidden rounded-t-lg transition-all duration-[600ms] cubic-bezier(0.25,1,0.5,1)"
          on:click={() => toggleImage(entry)}
          on:keydown={(e) => handleKey(e, entry)}
          role="button"
          tabindex="0"
          aria-label="点击展开图片详情"
        >
          <img
            src={entry.data.image}
            alt={entry.data.title}
            class="gallery-image w-full h-auto object-cover block rounded-t-lg transition-[max-height,transform] duration-[600ms] cubic-bezier(0.25,1,0.5,1)"
          />
          {#if entry.data.logo}
            <div class="logo-overlay absolute bottom-2 left-1/2 -translate-x-1/2 z-20 rounded-lg p-1 transition-opacity duration-[600ms] cubic-bezier(0.25,1,0.5,1) {expandedImages.has(entry.id) ? 'opacity-0' : 'opacity-30'}">
              <img
                src={entry.data.logo}
                alt="Logo"
                class="logo-image max-w-[80px] object-contain block"
              />
            </div>
          {/if}
        </div>

        <div class="article-content relative z-10 p-0 bg-transparent opacity-0 max-h-0 overflow-hidden transition-[opacity,max-height,padding] duration-[600ms] cubic-bezier(0.25,1,0.5,1) {expandedImages.has(entry.id) ? 'visible' : ''}">
          <div class="h-px bg-[#e0e0e0] mx-4 mb-4"></div>
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold dark:text-neutral-50 transition">{entry.data.title}</h3>
            {#if entry.data.location}
              <div class="details-location inline-flex items-center px-3 py-1.5 bg-[#dbeafe] text-[#98def0] rounded-full text-sm dark:bg-[#1e3a8a] dark:text-[#93c5fd]">
                <span>📍 {entry.data.location}</span>
              </div>
            {/if}
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400">{entry.data.description}</p>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .gallery-card:not(.expanded) .gallery-image {
    transform: scale(1);
    max-height: 1000px;
  }

  .gallery-card.expanded .gallery-image {
    transform: scale(0.95);
    max-height: 500px;
  }

  @media (max-width: 768px) { 
      .gallery-card.expanded .gallery-image {
    max-height: 300px;
  }
  }

  .article-content.visible {
    padding: 0 1rem 1rem 1rem;
    opacity: 1;
    max-height: 1000px;
  }
</style>