// static/js/earth_map.js
(function () {
  const GEOLOCAL = "/static/data/countries.geojson"; // مسیر محلی پیشنهادی
  const GEO_REMOTE = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
  const REST_BASE = "https://restcountries.com/v3.1/name/";

  const svg = d3.select("#map");
  const width = Math.max(window.innerWidth - 340, 600);
  const height = window.innerHeight;
  svg.attr("width", width).attr("height", height);

  const projection = d3.geoNaturalEarth1().scale(width / 6.3).translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  const countryNameEl = document.getElementById("countryName");
  const countryInfoEl = document.getElementById("countryInfo");
  const flagWrap = document.getElementById("flagWrap");
  const introEl = document.getElementById("intro");
  const extraEl = document.getElementById("extra");

  function clearInfo() {
    introEl.style.display = "block";
    countryNameEl.innerText = "";
    countryInfoEl.innerHTML = "";
    flagWrap.innerHTML = "";
    extraEl.innerText = "";
  }

  function showBasic(name) {
    introEl.style.display = "none";
    countryNameEl.innerText = name;
    countryInfoEl.innerHTML = <div class="meta">برای اطلاعات کامل کلیک کنید</div>;
    flagWrap.innerHTML = "";
  }

  async function fetchGeoJSON() {
    // تلاش اول: فایل محلی
    try {
      const r = await fetch(GEOLOCAL);
      if (r.ok) {
        const j = await r.json();
        return j;
      }
    } catch (e) {
      console.log("Local geojson not available, fallback to remote.");
    }
    // fallback to remote
    const r2 = await fetch(GEO_REMOTE);
    if (!r2.ok) throw new Error("Cannot load geojson from remote");
    return await r2.json();
  }

  function styleFeature(d) {
    return {
      fill: "rgba(0,200,255,0.06)",
      stroke: "#003a45",
      strokeWidth: 0.4
    };
  }

  function highlight(d3elem) {
    d3elem.attr("fill", "rgba(255,213,79,0.12)").attr("stroke", "#ffd54f").attr("stroke-width", 1.2);
  }

  function resetStyle(d3elem) {
    d3elem.attr("fill", "rgba(0,200,255,0.06)").attr("stroke", "#003a45").attr("stroke-width", 0.4);
  }

  async function load() {
    try {
      const geo = await fetchGeoJSON();
      const features = geo.features;

      // paths (اختیاری می‌توان نمایش نداد تا فقط متن دیده شود)
      svg.append("g")
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "rgba(0,200,255,0.04)")
        .attr("stroke", "rgba(0,200,255,0.15)")
        .attr("stroke-width", 0.3)
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "rgba(255,213,79,0.08)").attr("stroke", "#ffd54f");
          showBasic(d.properties.ADMIN || d.properties.NAME || "نامشخص");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "rgba(0,200,255,0.04)").attr("stroke", "rgba(0,200,255,0.15)");
          clearInfo();
        })
        .on("click", function (event, d) {
          loadCountryDetails(d);
        });

      // labels: نام کشورها به صورت متن روی نقشه
      const labels = svg.append("g")
        .selectAll("text")
        .data(features)
        .enter()
        .append("text")
        .attr("class", "country-label")
        .attr("transform", function (d) {
          const c = path.centroid(d);
          return translate(${c[0]},${c[1]});
        })
        .text(d => {
          return d.properties.ADMIN || d.properties.NAME || "";
        })
        .attr("font-size", function (d) {
          // اندازه بر اساس مساحت یا طول/عرض شکل تخمینی
          // اگر properties.AREA موجود نیست، از مقیاس ثابت استفاده کن
          const area = d.properties.AREA || (d.bbox ? (d.bbox[2]-d.bbox[0])*(d.bbox[3]-d.bbox[1]) : 1000);