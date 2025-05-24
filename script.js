const feeds = {
  "West Coast Chapter": "FD15",
  "WR3 Committee": "FD33",
  "Wastewater Process Committee": "FD32",
  "Utility Management Committee": "FD31",
  "SYPC Committee": "FD30",
  "Southwest Chapter": "FD35",
  "Southeast Chapter": "FD34",
  "South Florida Chapter": "FD22",
  "Safety Committee": "FD29",
  "PCOC Committee": "FD28",
  "Operations Challenge Committee": "FD27",
  "Manasota Chapter": "FD11",
  "Global Sponsors": "FD6",
  "First Coast Chapter": "FD21",
  "Emerging Water Technology Committee": "FD26",
  "Contractors Committee": "FD36",
  "Collection Systems Committee": "FD25",
  "Central Florida Chapter": "FD20",
  "Biosolids Committee": "FD24",
  "Air Quality Committee": "FD23"
};

document.getElementById("chapterSelect").addEventListener("change", function () {
  const selected = this.value;
  if (!selected) return;

  const galleryId = feeds[selected];
  const feedUrl = `https://mms.fwea.org/slideshows/slick_feed.php?org_id=FWEA&ban=${galleryId}&speed=5&view_feed=Y`;

  const grid = document.getElementById("sponsorGrid");
  grid.innerHTML = ""; // Clear previous

  fetch(feedUrl)
    .then(response => response.text())
    .then(html => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const imageLinks = tempDiv.querySelectorAll("a");
      const totalImages = imageLinks.length;
      const colCount = Math.min(totalImages, 5);
      grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;

      imageLinks.forEach(link => {
        const img = link.querySelector("img");
        if (img) {
          const anchor = document.createElement("a");
          anchor.href = link.href;
          anchor.target = "_blank";
          anchor.style.display = "block";
          anchor.style.width = "100%";
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

      document.getElementById("downloadBtn").style.display = "inline-block";
    });
});

document.getElementById("downloadBtn").addEventListener("click", function () {
  const grid = document.getElementById("sponsorGridWrapper");
  html2canvas(grid).then(canvas => {
    const link = document.createElement("a");
    link.download = "FWEA-sponsor-grid.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});
