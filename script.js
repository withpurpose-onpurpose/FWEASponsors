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

  grid.innerHTML = ""; // Clear previous content
  wrapper.setAttribute("data-gallery-id", galleryId);

  const url = `https://mms.fwea.org/slideshows/slick_feed.php?org_id=FWEA&ban=${galleryId}&speed=5&view_feed=Y`;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const imageLinks = tempDiv.querySelectorAll("a");

      const totalImages = imageLinks.length;
      const colCount = Math.min(totalImages, 5);
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
      grid.style.justifyItems = "center";
      grid.style.alignItems = "center";

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
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching sponsor data:", error);
    });
}

function downloadGridAsImage() {
  const grid = document.getElementById("sponsorGridWrapper");
  html2canvas(grid).then((canvas) => {
    const link = document.createElement("a");
    link.download = "sponsor-grid.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
