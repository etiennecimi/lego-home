document.addEventListener('DOMContentLoaded', () => {
    // -------------------- Carousel Logic --------------------
    let slideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let carouselInterval; // Variable, um das Intervall zu speichern

    function showSlides() {
        slides.forEach(slide => slide.style.display = 'none');
        slideIndex++;
        if (slideIndex > totalSlides) {
            slideIndex = 1;
        }
        slides[slideIndex - 1].style.display = 'flex'; // Use flex to center content
    }

    // Funktion zum Starten des Karussells
    function startCarousel() {
        showSlides(); // Zeige die erste Folie sofort
        // Clear any existing interval to prevent multiple intervals running
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
        carouselInterval = setInterval(() => {
            showSlides(); // Wechselt die Folie alle 5 Sekunden
        }, 5000);
    }

    // Beim Laden der Seite das Karussell starten
    startCarousel();

    // Optional: Karussell anhalten, wenn der Benutzer darüberfährt, und fortsetzen, wenn er die Maus entfernt
    const carouselContainer = document.querySelector('.hero-carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            startCarousel();
        });
    }

    // -------------------- Hotspot Logic --------------------
    const hotspots = document.querySelectorAll('.hotspot');
    const infoBoxes = document.querySelectorAll('.info-box');

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const infoBoxId = hotspot.dataset.infoId;
            const targetInfoBox = document.getElementById(infoBoxId);

            // Close any currently active info box
            infoBoxes.forEach(box => {
                if (box !== targetInfoBox && box.classList.contains('active')) {
                    box.classList.remove('active');
                }
            });

            // Toggle the clicked info box
            targetInfoBox.classList.toggle('active');

            // Position the info box relative to the hotspot
            const hotspotRect = hotspot.getBoundingClientRect();
            const brickImage = document.querySelector('.brick-image');
            const brickImageRect = brickImage.getBoundingClientRect();

            let newLeft = hotspotRect.left - brickImageRect.left + (hotspotRect.width / 2);
            let newTop = hotspotRect.top - brickImageRect.top + (hotspotRect.height / 2);

            targetInfoBox.style.left = `${newLeft}px`;
            targetInfoBox.style.top = `${newTop}px`;
        });
    });

    document.querySelectorAll('.close-info').forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.closest('.info-box').classList.remove('active');
        });
    });

    // Close info box when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.hotspot') && !event.target.closest('.info-box')) {
            infoBoxes.forEach(box => box.classList.remove('active'));
        }
    });

    // -------------------- Mobile Menu Toggle --------------------
    window.toggleMenu = function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('open');
    }

    // -------------------- Load More Products Logic --------------------
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const backBtn = document.getElementById('backBtn');
    const featuredProductsList = document.getElementById('featuredProductsList');

    const additionalProducts = [
        {
            imgSrc: 'images/lego-bed.png',
            altText: 'Lego Brickbed',
            title: 'Lego Brickbed',
            price: '$1299',
            description: 'Ein stabiles Bett aus LEGO® Elementen. Süße Träume garantiert!'
        },
        {
            imgSrc: 'images/lego-bookshelf.png',
            altText: 'Lego Brickshelf',
            title: 'Lego Brickshelf',
            price: '$499',
            description: 'Flexibles Regal für Bücher, Deko und deine LEGO® Sammlungen.'
        },
        {
            imgSrc: 'images/lego-desk.png',
            altText: 'Lego WorkZone',
            title: 'Lego WorkZone',
            price: '$899',
            description: 'Der perfekte Schreibtisch für kreatives Arbeiten und konzentriertes Bauen.'
        },
        {
            imgSrc: 'images/lego-roomdivider.png',
            altText: 'Lego WallFlex',
            title: 'Lego WallFlex',
            price: '$649',
            description: 'Modularer Raumteiler für flexible Gestaltung und individuelle Privatsphäre.'
        },
        {
            imgSrc: 'images/lego-wardrobe.png',
            altText: 'Lego DressUp',
            title: 'Lego DressUp',
            price: '$999',
            description: 'Dein persönlicher Kleiderschrank, der mit jedem LEGO®-Set mitwächst.'
        }
    ];

    if (loadMoreBtn && backBtn && featuredProductsList) {
        loadMoreBtn.addEventListener('click', () => {
            const productsToLoad = additionalProducts.slice(0);

            productsToLoad.forEach(productData => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product', 'additional-product', 'fade-in-element'); // Add fade-in-element class
                productDiv.innerHTML = `
                    <img src="${productData.imgSrc}" alt="${productData.altText}" />
                    <h3>${productData.title} – ${productData.price}</h3>
                    <p>${productData.description}</p>
                    <button>BUY</button>
                `;
                featuredProductsList.appendChild(productDiv);
                // Observe the newly added product
                observer.observe(productDiv);
            });

            loadMoreBtn.style.display = 'none';
            backBtn.style.display = 'inline-block';
        });

        backBtn.addEventListener('click', () => {
            const addedProducts = document.querySelectorAll('.additional-product');
            addedProducts.forEach(product => {
                observer.unobserve(product); // Stop observing removed elements
                product.remove();
            });

            loadMoreBtn.style.display = 'inline-block';
            backBtn.style.display = 'none';
        });
    }

    // -------------------- Fade-In on Scroll Logic --------------------
    const fadeInElements = document.querySelectorAll('section:not(.hero-carousel), .product, .review, .footer-columns'); // Select sections, products, reviews, and footer columns

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // When 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-active');
                observer.unobserve(entry.target); // Stop observing once it's animated
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        element.classList.add('fade-in-element'); // Add initial hidden state class
        observer.observe(element);
    });

    // Special handling for initially visible elements in carousel that shouldn't fade in
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        heroCarousel.classList.remove('fade-in-element'); // Ensure hero carousel doesn't fade in
        observer.unobserve(heroCarousel); // Stop observing if it was added
    }

});