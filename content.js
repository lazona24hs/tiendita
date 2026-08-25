const WHATSAPP_NUMBER = "5493412277147";

    const productos = [
      { id: 1, nombre: "Docena de Medias", categoria: "Ropa", precio: 5300, img: "https://i.imgur.com/Gnw11e4.jpeg?w=400" },
      { id: 2, nombre: "Kit Regalo Día de la Madre", categoria: "Regalería", precio: 35000, img: "https://i.imgur.com/GtZghk5.jpeg?w=400" },
      { id: 3, nombre: "Set de Mate Térmico", categoria: "Bazar", precio: 55900, img: "https://i.imgur.com/IySj9u8.png?w=400" },
      { id: 4, nombre: "Taza Gris Oscuro Mate", categoria: "Bazar", precio: 4500, img: "https://i.imgur.com/3ihlnrL.png?w=400" },
      { id: 5, nombre: "Set de Lapiceras Color", categoria: "Librería", precio: 3200, img: "https://i.imgur.com/6dARhQZ.jpeg?w=400" },
      { id: 6, nombre: "Botella Deportiva 1L", categoria: "Bazar", precio: 5400, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400" },
         { id: 7, nombre: "Anotador Hello Kitty", categoria: "Librería", precio: 5400, img: "https://i.imgur.com/WhfNPTN.png?w=400" }
    ];

    let carrito = [];
    let categoriaActiva = "Todos";

    // Función para cambiar de modo claro a oscuro
    function toggleLuz() {
      const html = document.documentElement;
      const body = document.body;
      const lightIcon = document.getElementById("lightIcon");
      const isDark = html.classList.contains("dark");

      if (isDark) {
        html.classList.remove("dark");
        body.classList.remove("bg-gray-900", "text-gray-100");
        body.classList.add("bg-gray-50", "text-gray-800");
        lightIcon.className = "fa-solid fa-moon text-lg";
      } else {
        html.classList.add("dark");
        body.classList.remove("bg-gray-50", "text-gray-800");
        body.classList.add("bg-gray-900", "text-gray-100");
        lightIcon.className = "fa-solid fa-lightbulb text-lg";
      }
      renderizarCategorias();
      filtrarProductos();
    }

    function renderizarCategorias() {
      const categorias = ["Todos", ...new Set(productos.map(p => p.categoria))];
      const container = document.getElementById("categoryContainer");
      const isDark = document.documentElement.classList.contains("dark");

      container.innerHTML = categorias.map(cat => `
        <button onclick="filtrarPorCategoria('${cat}')" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition ${categoriaActiva === cat ? 'bg-indigo-600 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}">
          ${cat}
        </button>
      `).join('');
    }

    function renderizarProductos(lista) {
      const grid = document.getElementById("productsGrid");
      if (lista.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">No se encontraron productos</p>`;
        return;
      }

      grid.innerHTML = lista.map(p => `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col justify-between hover:shadow-lg transition">
          <div>
            <img src="${p.img}" alt="${p.nombre}" class="w-full h-36 sm:h-48 object-cover">
            <div class="p-3 sm:p-4">
              <span class="text-xs text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-wider">${p.categoria}</span>
              <h3 class="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base leading-tight mt-1">${p.nombre}</h3>
            </div>
          </div>
          <div class="p-3 sm:p-4 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span class="text-lg font-extrabold text-gray-900 dark:text-white">$${p.precio.toLocaleString()}</span>
            <button onclick="agregarAlCarrito(${p.id})" class="w-full sm:w-auto bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1">
              <i class="fa-solid fa-plus"></i> Agregar
            </button>
          </div>
        </div>
      `).join('');
    }

    function filtrarProductos() {
      const texto = document.getElementById("searchInput").value.toLowerCase();
      const filtrados = productos.filter(p => {
        const coincideCat = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
        const coincideTexto = p.nombre.toLowerCase().includes(texto);
        return coincideCat && coincideTexto;
      });
      renderizarProductos(filtrados);
    }

    function filtrarPorCategoria(cat) {
      categoriaActiva = cat;
      renderizarCategorias();
      filtrarProductos();
    }

    function agregarAlCarrito(id) {
      const producto = productos.find(p => p.id === id);
      const item = carrito.find(i => i.id === id);
      if (item) {
        item.cantidad++;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }
      actualizarCarrito();
    }

    function cambiarCantidad(id, cambio) {
      const item = carrito.find(i => i.id === id);
      if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
          carrito = carrito.filter(i => i.id !== id);
        }
      }
      actualizarCarrito();
    }

    function actualizarCarrito() {
      const badge = document.getElementById("cartBadge");
      const itemsContainer = document.getElementById("cartItems");
      const totalContainer = document.getElementById("cartTotal");

      const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
      const totalPrecio = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);

      badge.innerText = totalItems;
      badge.classList.toggle("hidden", totalItems === 0);

      if (carrito.length === 0) {
        itemsContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 my-8">El carrito está vacío</p>`;
      } else {
        itemsContainer.innerHTML = carrito.map(i => `
          <div class="py-3 flex justify-between items-center">
            <div class="flex-1 pr-2">
              <h4 class="font-bold text-sm text-gray-800 dark:text-gray-200">${i.nombre}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">$${i.precio.toLocaleString()} x ${i.cantidad}</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="cambiarCantidad(${i.id}, -1)" class="w-6 h-6 bg-gray-200 dark:bg-gray-700 dark:text-white rounded flex items-center justify-center font-bold text-gray-600">-</button>
              <span class="text-sm font-bold text-gray-800 dark:text-gray-200">${i.cantidad}</span>
              <button onclick="cambiarCantidad(${i.id}, 1)" class="w-6 h-6 bg-gray-200 dark:bg-gray-700 dark:text-white rounded flex items-center justify-center font-bold text-gray-600">+</button>
            </div>
          </div>
        `).join('');
      }

      totalContainer.innerText = `$${totalPrecio.toLocaleString()}`;
    }

    function toggleCartModal() {
      document.getElementById("cartModal").classList.toggle("hidden");
    }

    function enviarWhatsApp() {
      if (carrito.length === 0) return alert("Tu carrito está vacío");

      let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
      carrito.forEach(i => {
        mensaje += `• *${i.nombre}* x${i.cantidad} ($${(i.precio * i.cantidad).toLocaleString()})\n`;
      });

      const total = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
      mensaje += `\n*Total estimado:* $${total.toLocaleString()}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
    }

    // Inicializar
    renderizarCategorias();
    renderizarProductos(productos);
