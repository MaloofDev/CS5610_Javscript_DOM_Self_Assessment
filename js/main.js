function MainModule(listingsID = "#listings") {
  const me = {};

  const listingsElement = document.querySelector(listingsID);
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 640 360%22%3E%3Crect width=%22640%22 height=%22360%22 fill=%22%23e5e7eb%22/%3E%3C/svg%3E";

  function getImageSrc(url) {
    if (typeof url === "string" && /^https?:\/\//.test(url.trim())) {
      return url.trim();
    }
    return placeholderImage;
  }

  // Swap any image that fails to load for the placeholder.
  function handleImageError(event) {
    const img = event.target;
    if (img.tagName === "IMG" && img.src !== placeholderImage) {
      img.src = placeholderImage;
    }
  }

  function escapeAttr(text) {
    return String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  function getAmenities(listing) {
    try {
      return JSON.parse(listing.amenities || "[]");
    } catch (error) {
      return [];
    }
  }

  function getListingCode(listing) {
    const amenities = getAmenities(listing);

    return `<div class="col-3">
  <div class="listing card">
    <img src="${getImageSrc(listing.picture_url)}" class="card-img-top" alt="${escapeAttr(listing.name || "AirBNB listing")}" />
    <div class="listing-header">
      <h2 class="card-title">${listing.name}</h2>
      <p class="card-text"><strong>Price:</strong> ${listing.price || "Unavailable"}</p>
    </div>
    <div class="host">
      <span><strong>Host:</strong> ${listing.host_name || "Unavailable"}</span>
      <img src="${getImageSrc(listing.host_picture_url)}" alt="${escapeAttr(listing.host_name || "Host")}" />
    </div>
    <div class="card-body">
      <h3>About</h3>
      <p class="card-description">${listing.description || "No description available."}</p>
      <h3>Amenities</h3>
      <ul>
        ${amenities.length ? amenities.map((amenity) => `<li>${amenity}</li>`).join("") : "<li>No amenities listed.</li>"}
      </ul>
    </div>
  </div>
  <!-- /card -->
  </div>

  `;
  }

  function redraw(listings) {
    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

  async function loadData() {
    const res = await fetch("./airbnb_sf_listings_500.json");
    if (!res.ok) {
      throw new Error(`Unable to load listings: ${res.status}`);
    }
    const listings = await res.json();

    me.redraw(listings.slice(0, 50));
  }

  listingsElement.addEventListener("error", handleImageError, true);

  me.redraw = redraw;
  me.loadData = loadData;

  return me;
}

const main = MainModule();

main.loadData();
