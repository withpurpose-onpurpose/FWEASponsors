window.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("loadGrid");
  const downloadBtn = document.getElementById("downloadImage");

  loadBtn.addEventListener("click", handleGenerate);
  downloadBtn.addEventListener("click", downloadGridAsImage);
});

function handleGenerate() {
  const select = document.getElementById("chapter");
  const galleryId = select.value;
  const wrapper = document.getElementById("sponsorGridWrapper");
  const grid = document.getElementById("sponsorGrid");
  const downloadBtn = document.getElementById("downloadImage");

  // Reset view
  downloadBtn.style.display = "none";
  grid.innerHTML = "";

  const url = `https://mms.fwea.org/slideshows/slick_feed.php?org_id=FWEA&ban=${galleryId}&speed=5&view_feed=Y`;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const imageLinks = tempDiv.querySelectorAll("a");

      const totalImages = imageLinks.length;
      const colCount = Math.min(totalImages, 5);
      grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;

      const loadPromises = [];

      imageLinks.forEach((link) => {
        const img = link.querySelector("img");
        if (img) {
          const anchor = document.createElement("a");
          anchor.href = link.href;
          anchor.target = "_blank";
          anchor.style.display = "block";
          anchor.style.padding = "2px";
          anchor.style.boxSizing = "border-box";

          img.style.display = "block";
          img.style.width = "100%";
          img.style.maxHeight = "80px";
          img.style.objectFit = "contain";
          img.style.margin = "0 auto";

          anchor.appendChild(img);
          grid.appendChild(anchor);

          // Ensure images are fully loaded
          loadPromises.push(
            new Promise((resolve) => {
              if (img.complete) resolve();
              else {
                img.onload = resolve;
                img.onerror = resolve;
              }
            })
          );
        }
      });

      Promise.all(loadPromises).then(() => {
        downloadBtn.style.display = "inline-block";
      });
    })
    .catch((error) => {
      console.error("Error loading sponsor grid:", error);
    });
}

function downloadGridAsImage() {
  const grid = document.getElementById("sponsorGridWrapper");

  html2canvas(grid, {
  useCORS: true,
  allowTaint: false,
  logging: true,
}).then((canvas) => {
  const link = document.createElement("a");
  link.download = "sponsor-grid.png";
  link.href = canvas.toDataURL();
  link.click();
  });
}
