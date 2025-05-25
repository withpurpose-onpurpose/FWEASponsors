// Updated script.js to generate multiple layout options with downloadable images

window.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("loadGridBtn");
  loadBtn.addEventListener("click", handleGenerate);
});

function handleGenerate() {
  const select = document.getElementById("chapterSelect");
  const galleryId = select.value;
  const url = `https://mms.fwea.org/slideshows/slick_feed.php?org_id=FWEA&ban=${galleryId}&speed=5&view_feed=Y`;

  fetch(url)
    .then((response) => response.text())
    .then(async (html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const imageLinks = tempDiv.querySelectorAll("a img");

      const imageBlobs = await Promise.all(
        Array.from(imageLinks).map(async (img) => {
          try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            return await blobToDataURL(blob);
          } catch (e) {
            console.error("Image load failed", e);
            return null;
          }
        })
      );

      const filteredImages = imageBlobs.filter(Boolean);
      const layoutOptions = [1, 2, 3, 4, 5, filteredImages.length];
      const gridContainer = document.getElementById("gridOutput");
      gridContainer.innerHTML = "";

      layoutOptions.forEach((cols) => {
        const title = document.createElement("h3");
        title.textContent = `${select.options[select.selectedIndex].text} - ${cols} Column Grid`;
        gridContainer.appendChild(title);

        const gridWrapper = document.createElement("div");
        gridWrapper.className = "fweaSponsorGallery variant";
        gridWrapper.style.display = "grid";
        gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridWrapper.style.gap = "8px";
        gridWrapper.style.marginBottom = "10px";

        filteredImages.forEach((dataUrl) => {
          const img = document.createElement("img");
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
    })
    .catch((err) => console.error("Failed to fetch grid:", err));
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function downloadGridAsImage(container) {
  html2canvas(container, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "sponsor-grid.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
