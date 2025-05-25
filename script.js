window.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("loadGridBtn");
  loadBtn.addEventListener("click", handleGenerate);
});

async function handleGenerate() {
  const select = document.getElementById("chapterSelect");
  const galleryId = select.value;
  const url = `https://mms.fwea.org/slideshows/slick_feed.php?org_id=FWEA&ban=${galleryId}&speed=5&view_feed=Y`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const imageNodes = tempDiv.querySelectorAll("a img");

    const imageBlobs = await Promise.all(
      Array.from(imageNodes).map(async (img) => {
        try {
          const res = await fetch(img.src, { mode: 'cors' });
          const blob = await res.blob();
          return await blobToDataURL(blob);
        } catch (e) {
          console.warn("Skipping failed image", img.src);
          return null;
        }
      })
    );

    const validImages = imageBlobs.filter(Boolean);
    const layoutOptions = [1, 2, 3, 4, 5, validImages.length]; // last = 1-row
    const gridContainer = document.getElementById("gridOutput");
    gridContainer.innerHTML = ""; // Clear old output

    layoutOptions.forEach((cols) => {
      const title = document.createElement("h3");
      title.textContent = `${select.options[select.selectedIndex].text} - ${cols} Column Grid`;
      gridContainer.appendChild(title);

      const gridWrapper = document.createElement("div");
      gridWrapper.className = "fweaSponsorGallery variant";
      gridWrapper.style.display = "grid";
      gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      gridWrapper.style.gap = "4px";
      gridWrapper.style.marginBottom = "10px";
      gridWrapper.style.padding = "8px";

      validImages.forEach((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.style.width = "100%";
        img.style.maxHeight = "80px";
        img.style.objectFit = "contain";
        gridWrapper.appendChild(img);
      });

      gridContainer.appendChild(gridWrapper);

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download this Grid as PNG";
      downloadBtn.onclick = () => downloadGridAsImage(gridWrapper);
      gridContainer.appendChild(downloadBtn);
    });
  } catch (err) {
    console.error("Grid generation failed:", err);
  }
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function downloadGridAsImage(container) {
  await waitForAllImages(container);

  html2canvas(container, {
    useCORS: true,
    allowTaint: false,
    backgroundColor: null
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "sponsor-grid.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function waitForAllImages(container) {
  const imgs = container.querySelectorAll("img");
  const promises = Array.from(imgs).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = img.onerror = resolve;
    });
  });
  return Promise.all(promises);
}
