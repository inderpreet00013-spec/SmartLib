async function searchBooks() {

    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value.trim();

    const category = document.getElementById("categoryFilter").value;

    const results = document.getElementById("results");

    if (!query) {
        results.innerHTML = `
            <div class="welcome">
                <h2>⚠️ Enter a search term</h2>
                <p>Please enter a book title, author or category.</p>
            </div>
        `;
        return;
    }

    results.innerHTML = `
        <div class="welcome">
            <h2>🔍 Searching...</h2>
        </div>
    `;

    try {

        const response = await fetch(
            fetch(`https://smartlib-backend-7a7f.onrender.com/search?q=${encodeURIComponent(query)}`)
        );

        const books = await response.json();
        const filteredBooks = category
    ? books.filter(book =>
        book.category &&
        book.category.toLowerCase() === category.toLowerCase()
      )
    : books;

        if (filteredBooks.length === 0) {

            results.innerHTML = `
                <div class="welcome">
                    <h2>📚 No books found</h2>
                    <p>Try another title, author or category.</p>
                </div>
            `;

            return;
        }

        results.innerHTML = `
    <p class="result-count">
        🔎 ${filteredBooks.length} book(s) found
    </p>
` + filteredBooks.map(book => {

            const availability = book.available
                ? `<span class="available">✅ Available</span>`
                : `<span class="not-available">❌ Not Available</span>`;

            return `
                <div class="book-card">

                    <h3>📖 ${book.title}</h3>

                    <p><strong>Author:</strong> ${book.author}</p>

                    <p>
                        <strong>Category:</strong>
                        ${book.category || "Not specified"}
                    </p>

                    <div class="location">

                        <h4>📍 Shelf Location</h4>

                        <p>
                            <strong>Section:</strong>
                            ${book.section || "N/A"}
                        </p>

                        <p>
                            <strong>Rack:</strong>
                            ${book.rack}
                        </p>

                        <p>
                            <strong>Shelf:</strong>
                            ${book.shelf}
                        </p>

                        <p>
                            <strong>Position:</strong>
                            ${book.position || "N/A"}
                        </p>

                    </div>

                    <p style="margin-top:15px;">
                        ${availability}
                    </p>

                    <button
    onclick="showShelfLocation('${book.rack}', ${book.shelf}, '${book.title}', ${book.position || 0}, ${book.available})"
    style="margin-top:15px; padding:10px 15px; cursor:pointer;"
>
    📍 Find on Map
</button>

                </div>
            `;

        }).join("");

    } catch (error) {

        results.innerHTML = `
            <div class="welcome">
                <h2>❌ Backend connection failed</h2>
                <p>
                    Make sure the FastAPI server is running.
                </p>
            </div>
        `;

        console.error(error);
    }
}
 function showShelfLocation(rackId, shelfNumber, bookTitle, position, available) {

    const map = document.getElementById("libraryMap");

    const racks = ["C-01", "C-02", "C-03"];

    const statusText = available ? "✅ Available" : "❌ Not Available";

    map.innerHTML = `
        <div style="text-align:center; margin-bottom:25px;">
            <h2>📖 ${bookTitle}</h2>

            <p style="font-size:18px;">
                📍 <strong>Rack ${rackId}</strong>
                → <strong>Shelf ${shelfNumber}</strong>
                → <strong>Position ${position}</strong>
            </p>

            <p style="font-size:16px; font-weight:bold;">
    ${statusText}
</p>
<div class="map-legend">

    <span>
        🟢 Available
    </span>

    <span>
        🔴 Not Available
    </span>

    <span>
        ⭐ Selected Book
    </span>


</div>

        </div>

        <div class="navigation-info">

    🧭 <strong>How to reach:</strong>

    Start → Rack ${rackId}
    → Shelf ${shelfNumber}
    → Position ${position}

</div>

<button
    onclick="document.getElementById('results').scrollIntoView({ behavior: 'smooth' })"
    class="back-search-btn"
>
    🔙 Back to Search Results
</button>

        <div class="navigation-info">

    🧭 <strong>How to reach:</strong>

    Start → Rack ${rackId}
    → Shelf ${shelfNumber}
    → Position ${position}

</div>

        <div style="
            display:flex;
            justify-content:center;
            gap:25px;
            flex-wrap:wrap;
        ">

            ${racks.map(rack => `

                <div class="rack">

                    <h3>📚 ${rack}</h3>

                    ${[1, 2, 3, 4].map(shelf => {

                        const selected =
                            rack === rackId && shelf == shelfNumber;

                        return `
    <div class="shelf ${selected ? "highlight" : ""}">

        <strong>Shelf ${shelf}</strong>

        <div class="position-grid">

            ${Array.from({ length: 20 }, (_, i) => i + 1)
                .map(pos => `
                    <div class="position-box ${
    selected && pos == position
        ? (available ? "selected available-position" : "selected unavailable-position")
        : ""
}">
                        ${pos == position && selected ? "⭐ " : ""}
                        ${pos}
                    </div>
                `)
                .join("")}

        </div>

    </div>
`;

                    }).join("")}

                </div>

            `).join("")}

        </div>
    `;
}
function resetSearch() {

    document.getElementById("searchInput").value = "";

    document.getElementById("categoryFilter").value = "";

    document.getElementById("results").innerHTML = `
        <div class="welcome">
            <h2>Welcome to SmartLib 👋</h2>
            <p>
                Search for a book to find its exact shelf location.
            </p>
        </div>
    `;

    document.getElementById("libraryMap").innerHTML = `
        <p>Select a book to see its shelf location.</p>
    `;
}
