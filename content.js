const WHATSAPP_NUMBER = "5493412277147";

    // LISTADO DE PRODUCTOS CON PROPIEDADES DE 'stock' Y 'opciones'
    const productos = [
      { id: 1,
       nombre: "Docena de Medias",
       categoria: "Ropa", precio: 5300, 
       stock: true,
       img: "https://i.imgur.com/Gnw11e4.jpeg?w=400",
       descripcion: "Pack de 12 pares de medias de excelente calidad, suaves y duraderas." },
      { id: 2,
       nombre: "Kit Regalo Día de la Madre", 
       categoria: "Regalería", precio: 35000, stock: true, 
       img: "https://i.imgur.com/GtZghk5.jpeg?w=400", 
       descripcion: "Hermoso set preparado especialmente con selección de artículos de calidad." },
      { id: 3, 
       nombre: "Set de Mate Térmico", 
       categoria: "Bazar", precio: 55900, 
       stock: true, opciones: ["Negro", "Verde Militar", "Rosa Pastel"],
       img: "https://i.imgur.com/IySj9u8.png?w=400", descripcion: "Mate térmico de acero inoxidable, conserva la temperatura por horas e incluye bombilla." },
      { id: 4, 
       nombre: "Taza Gris Oscuro Mate", 
       categoria: "Bazar", precio: 4500, 
       stock: true, 
       img: "https://i.imgur.com/3ihlnrL.png?w=400",
       descripcion: "Taza de cerámica con acabado mate elegante, ideal para uso diario." },
      { id: 5, 
       nombre: "Set de Lapiceras Color",
       categoria: "Librería", precio: 3200,
       stock: true,
       img: "https://i.imgur.com/6dARhQZ.jpeg?w=400",
       descripcion: "Set variado de lapiceras de tinta gel para apuntes creativos y organizados." },
      { id: 6, 
       nombre: "Botella Deportiva 1L", 
       categoria: "Bazar", precio: 5400, 
       stock: true, opciones: ["Azul", "Rosa", "Negro"],
       img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", 
       descripcion: "Botella libre de BPA con pico deportivo y medidor de hidratación." },
      { id: 7, 
       nombre: "Anotador Hello Kitty", 
       categoria: "Librería", precio: 5400, 
       stock: false, 
       img: "https://i.imgur.com/WhfNPTN.png?w=400",
       descripcion: "Anotador con tapas duras, hojas rayadas y diseño exclusivo de Hello Kitty." },
      { id: 8, 
       nombre: "Llaveros Personajes", 
       categoria: "Accesorios", precio: 3000, 
       stock: true, opciones: ["Pikachu", "Stitch", "Super Mario", "Spider-Man"],
       img: "https://i.imgur.com/MrLNDWP.png?w=400", 
       descripcion: "Llaveros de silicona coleccionables con argolla reinforced. Elegí tu personaje preferido." }
    ];

    let carrito = [];
    let categoriaActiva = "Todos";
    let captchaRespuesta = 0;
    let cuponAplicado = null;

    const cuponesValidos = {
      "MYJ": 0.00,
      "MYJ20": 0.20
    };

    function generarCaptcha() {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      captchaRespuesta = num1 + num2;
      document.getElementById('captchaLabel').innerText = `Verificación: ¿Cuánto es ${num1} + ${num2}?`;
    }

    function validarCaptcha(event) {
      const input = parseInt(document.getElementById('captchaInput').value);
      if (input !== captchaRespuesta) {
        alert("La respuesta del captcha es incorrecta. Intenta nuevamente.");
        generarCaptcha();
        document.getElementById('captchaInput').value = '';
        event.preventDefault();
        return false;
      }
      return true;
    }

    function toggleContactModal() {
      const modal = document.getElementById("contactModal");
      const isHidden = modal.classList.contains("hidden");
      if (isHidden) {
        generarCaptcha();
        modal.classList.remove("hidden");
      } else {
        modal.classList.add("hidden");
      }
    }

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

      grid.innerHTML = lista.map(p => {
        const sinStock = p.stock === false;
        return `
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col justify-between hover:shadow-lg transition relative ${sinStock ? 'opacity-75' : ''}">
            
            ${sinStock ? `<span class="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">SIN STOCK</span>` : ''}

            <div class="cursor-pointer" onclick="verDetalleProducto(${p.id})">
              <img src="${p.img}" alt="${p.nombre}" class="w-full h-36 sm:h-48 object-cover hover:scale-105 transition duration-300 ${sinStock ? 'grayscale-[50%]' : ''}">
              <div class="p-3 sm:p-4">
                <span class="text-xs text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-wider">${p.categoria}</span>
                <h3 class="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base leading-tight mt-1">${p.nombre}</h3>
              </div>
            </div>
            
            <div class="p-3 sm:p-4 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span class="text-lg font-extrabold text-gray-900 dark:text-white">$${p.precio.toLocaleString()}</span>
              
              <button onclick="verDetalleProducto(${p.id})" 
                      class="w-full sm:w-auto ${sinStock ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' : 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white'} px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1">
                ${sinStock ? 'Agotado' : (p.opciones ? 'Elegir' : 'Agregar')}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function verDetalleProducto(id) {
      const producto = productos.find(p => p.id === id);
      if (!producto) return;

      document.getElementById('detailProductImage').src = producto.img;
      document.getElementById('detailProductTitle').innerText = producto.nombre;
      document.getElementById('detailProductCategory').innerText = producto.categoria;
      document.getElementById('detailProductPrice').innerText = `$${producto.precio.toLocaleString()}`;
      document.getElementById('detailProductDescription').innerText = producto.descripcion || 'Sin descripción disponible.';

      const badge = document.getElementById('detailProductBadge');
      const addBtn = document.getElementById('detailAddBtn');
      const optionContainer = document.getElementById('optionContainer');
      const select = document.getElementById('productOptionSelect');

      if (producto.stock === false) {
        badge.classList.remove('hidden');
        addBtn.disabled = true;
        addBtn.innerText = "Producto Agotado";
      } else {
        badge.classList.add('hidden');
        addBtn.disabled = false;
        addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Agregar al carrito`;
      }

      if (producto.opciones && producto.opciones.length > 0) {
        optionContainer.classList.remove('hidden');
        select.innerHTML = producto.opciones.map(opt => `<option value="${opt}">${opt}</option>`).join('');
      } else {
        optionContainer.classList.add('hidden');
        select.innerHTML = '';
      }

      addBtn.onclick = function() {
        if (producto.stock === false) return;
        
        let opcionSeleccionada = null;
        if (producto.opciones && producto.opciones.length > 0) {
          opcionSeleccionada = select.value;
        }

        agregarAlCarrito(producto.id, opcionSeleccionada);
        cerrarDetalleProducto();
      };

      document.getElementById('productDetailModal').classList.remove('hidden');
    }

    function cerrarDetalleProducto(e) {
      if (!e || e.target.id === 'productDetailModal' || e.target.tagName === 'BUTTON') {
        document.getElementById('productDetailModal').classList.add('hidden');
      }
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

    function agregarAlCarrito(id, opcion = null) {
      const producto = productos.find(p => p.id === id);
      if (!producto || producto.stock === false) return;

      const cartItemId = opcion ? `${id}-${opcion}` : `${id}`;
      const itemExistente = carrito.find(i => i.cartItemId === cartItemId);

      if (itemExistente) {
        itemExistente.cantidad++;
      } else {
        const nombreMostrado = opcion ? `${producto.nombre} (${opcion})` : producto.nombre;
        carrito.push({ ...producto, cartItemId, nombreMostrado, opcion, cantidad: 1 });
      }

      actualizarCarrito();
    }

    function cambiarCantidad(cartItemId, cambio) {
      const item = carrito.find(i => i.cartItemId === cartItemId);
      if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
          carrito = carrito.filter(i => i.cartItemId !== cartItemId);
        }
      }
      actualizarCarrito();
    }

    function aplicarCupon() {
      const input = document.getElementById("couponInput").value.trim().toUpperCase();
      const msg = document.getElementById("couponMessage");

      if (cuponesValidos[input]) {
        cuponAplicado = { codigo: input, porcentaje: cuponesValidos[input] };
        msg.innerText = `¡Cupón ${input} aplicado con éxito!`;
        msg.className = "text-xs text-green-500 block";
      } else {
        cuponAplicado = null;
        msg.innerText = "Código de cupón inválido.";
        msg.className = "text-xs text-red-500 block";
      }
      actualizarCarrito();
    }

    function actualizarCarrito() {
      const badge = document.getElementById("cartBadge");
      const itemsContainer = document.getElementById("cartItems");
      const subtotalContainer = document.getElementById("cartSubtotal");
      const discountRow = document.getElementById("discountRow");
      const discountContainer = document.getElementById("cartDiscount");
      const totalContainer = document.getElementById("cartTotal");

      const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
      const subtotal = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
      
      let descuento = 0;
      if (cuponAplicado) {
        descuento = subtotal * cuponAplicado.porcentaje;
      }
      const totalFinal = subtotal - descuento;

      badge.innerText = totalItems;
      badge.classList.toggle("hidden", totalItems === 0);

      if (carrito.length === 0) {
        itemsContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 my-8">El carrito está vacío</p>`;
      } else {
        itemsContainer.innerHTML = carrito.map(i => `
          <div class="py-3 flex justify-between items-center">
            <div class="flex-1 pr-2">
              <h4 class="font-bold text-sm text-gray-800 dark:text-gray-200">${i.nombreMostrado}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">$${i.precio.toLocaleString()} x ${i.cantidad}</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="cambiarCantidad('${i.cartItemId}', -1)" class="w-6 h-6 bg-gray-200 dark:bg-gray-700 dark:text-white rounded flex items-center justify-center font-bold text-gray-600">-</button>
              <span class="text-sm font-bold text-gray-800 dark:text-gray-200">${i.cantidad}</span>
              <button onclick="cambiarCantidad('${i.cartItemId}', 1)" class="w-6 h-6 bg-gray-200 dark:bg-gray-700 dark:text-white rounded flex items-center justify-center font-bold text-gray-600">+</button>
            </div>
          </div>
        `).join('');
      }

      subtotalContainer.innerText = `$${subtotal.toLocaleString()}`;
      if (descuento > 0) {
        discountRow.classList.remove("hidden");
        discountContainer.innerText = `-$${descuento.toLocaleString()}`;
      } else {
        discountRow.classList.add("hidden");
      }
      totalContainer.innerText = `$${totalFinal.toLocaleString()}`;
    }

    function toggleCartModal() {
      document.getElementById("cartModal").classList.toggle("hidden");
    }

    function enviarWhatsApp() {
      if (carrito.length === 0) return alert("Tu carrito está vacío");

      let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
      carrito.forEach(i => {
        mensaje += `• *${i.nombreMostrado}* x${i.cantidad} ($${(i.precio * i.cantidad).toLocaleString()})\n`;
      });

      const subtotal = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
      let descuento = cuponAplicado ? subtotal * cuponAplicado.porcentaje : 0;
      const total = subtotal - descuento;

      if (cuponAplicado) {
        mensaje += `\n*Cupón:* ${cuponAplicado.codigo} (-$${descuento.toLocaleString()})`;
      }

      mensaje += `\n*Total a pagar:* $${total.toLocaleString()}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
    }

    renderizarCategorias();
    renderizarProductos(productos);
