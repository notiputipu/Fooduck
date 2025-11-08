// warung.js – universal untuk warung1..warung6
document.addEventListener("DOMContentLoaded", () => {
  // === CONFIG: data untuk tiap warung ===
  const WARUNGS = {
    warung1: {
      id: "warung1",
      name: "Lotek dan Gado-gado 'Cik Eva'",
      image: "images/warung1.png",
      menu: [
        { id: "m1", type: "food", name: "Lotek", price: "12000", desc: "Fresh vegetables with peanut sauce", img: "images/lotek.jpeg" },
        { id: "m2", type: "food", name: "Gado-Gado", price: "15000", desc: "Mixed vegetables salad", img: "images/gado gado.jpeg" },
        { id: "m3", type: "food", name: "Kupat Tahu", price: "12000", desc: "Rice cake with tofu", img: "images/Kupat Tahu.jpeg" },
        { id: "m4", type: "food", name: "Tahu Telur", price: "15000", desc: "Tofu omelette", img: "images/tahu telor.jpeg" },
      ]
    },
    warung2: {
      id: "warung2",
      name: "Masakan Padang \"Resto Bundo\"",
      image: "images/warung2.png",
      menu: [
        { id: "m1", type: "food", name: "Nasi Sayur Sambal", price: "5000", desc: "", img: "images/NasiSayurSambel.jpeg" },
        { id: "m2", type: "food", name: "Ayam", price: "8500", desc: "", img: "images/AyamGoreng.jpeg" },
        { id: "m3", type: "food", name: "Perkedel", price: "5000", desc: "", img: "images/Perkedel.jpeg" },
        { id: "m4", type: "food", name: "Telur", price: "5000", desc: "", img: "images/Telur Balado.jpeg" },
        { id: "m5", type: "food", name: "Rendang", price: "11500", desc: "", img: "images/Rendang Sapi.jpeg" },
        { id: "m6", type: "food", name: "Ikan", price: "9000", desc: "", img: "images/Ikan.jpeg" },
        { id: "d1", type: "food", name: "Tahu/Tempe", price: "2000", desc: "", img: "images/Tempe tahu goreng.jpeg" },
      ]
    },
    warung3: {
      id: "warung3",
      name: "Warung Prasmanan Barokah",
      image: "images/warung3.png",
      menu: [
        { id: "m1", type: "food", name: "Nasi Sayur", price: "8000", desc: "", img: "images/NasiSayurSambel.jpeg" },
        { id: "m2", type: "food", name: "Ayam", price: "8000", desc: "", img: "images/Ayam Goreng Kuning.jpeg" },
        { id: "m3", type: "food", name: "Ikan", price: "8000", desc: "", img: "images/Ikan goreng potong.jpeg" },
        { id: "m4", type: "food", name: "Kikil", price: "8000", desc: "", img: "images/kikil.jpeg" },
        { id: "m5", type: "food", name: "Telur", price: "5000", desc: "", img: "images/Telor Ceplok Kuah Kecap.jpeg" },
        { id: "m6", type: "food", name: "Galantin", price: "5000", desc: "", img: "images/galantin ayam goreng.jpeg" },
        { id: "m7", type: "food", name: "Tahu", price: "1000", desc: "", img: "images/tahu.jpeg" },
        { id: "m8", type: "food", name: "Tempe", price: "1000", desc: "", img: "images/Tempe.jpeg" },
        { id: "m9", type: "food", name: "Kerupuk", price: "1000", desc: "", img: "images/kerupuk.jpeg" },
      ]
    },
    warung4: {
      id: "warung4",
      name: "Soto Ayam 'Mororene'",
      image: "images/warung4.png",
      menu: [
        { id: "m1", type: "food", name: "Soto Ayam Campur", price: "10000", desc: "", img: "images/soto ayam.jpeg" },
        { id: "m2", type: "food", name: "Soto Ayam Pisah", price: "12000", desc: "", img: "images/soto ayam.jpeg" },
        { id: "m3", type: "food", name: "Soto Sapi", price: "13000", desc: "", img: "images/Soto Daging.jpeg" },
        { id: "m4", type: "food", name: "Soto Sapi Pisah", price: "15000", desc: "", img: "images/Soto Daging.jpeg" },
        { id: "m5", type: "food", name: "Nasi Ayam Bakar", price: "14000", desc: "", img: "images/Nasi Ayam Bakar.jpeg" },
      ]
    },
    warung5: {
      id: "warung5",
      name: "Kedai Bakso 'Nakmantu'",
      image: "images/warung5.png",
      menu: [
        { id: "m1", type: "food", name: "Bakso Komplit", price: "10000", desc: "", img: "images/bakso.jpeg" },
        { id: "m2", type: "food", name: "Bakso Kawi", price: "10000", desc: "", img: "images/Bakso Malang.jpeg" },
        { id: "m3", type: "food", name: "Bakso Komplit + Ketupat", price: "12000", desc: "", img: "images/bakso.jpeg" },
        { id: "m4", type: "food", name: "Bakso Komplit Spesial", price: "15000", desc: "Telur/ Daging/ Urat/ Tetelan/ Mercon", img: "images/baksospesial.jpeg" },
        { id: "m5", type: "food", name: "Ketupat", price: "2000", desc: "", img: "images/ketupat.jpeg" },
      ]
    },
    warung6: {
      id: "warung6",
      name: "Bakmie Ayam Siliwangi",
      image: "images/warung6.png",
      menu: [
        { id: "m1", type: "food", name: "Bakmie Ayam Panggang", price: "15000", desc: "", img: "images/bakmi ayam panggang.jpeg" },
        { id: "m2", type: "food", name: "Bakmi Ayam Jamur", price: "15000", desc: "", img: "images/Mie Ayam jamur.jpeg" },
        { id: "m3", type: "food", name: "Bakmi Ayam Madu", price: "15000", desc: "", img: "images/Mie madu.jpeg" },
        { id: "m4", type: "food", name: "Pangsit", price: "3000", desc: "Topping", img: "images/Pangsit Goreng.jpeg" },
        { id: "m5", type: "food", name: "Bakso", price: "4000", desc: "Topping", img: "images/bakso.jpeg" },
        { id: "m6", type: "food", name: "Kulit Ayam Krispy", price: "3000", desc: "Topping", img: "images/crispy chicken skin.jpeg" },
      ]
    }
  };

  const filename = window.location.pathname.split("/").pop().split(".")[0] || "warung1";
  const warungKey = filename.toLowerCase();
  const warungData = WARUNGS[warungKey] || WARUNGS["warung1"];

  const menuGrid = document.getElementById("menu-grid");
  const orderListEl = document.getElementById("order-list");
  const clearBtn = document.getElementById("clear-order");
  const checkoutBtn = document.getElementById("checkout");
  const modal = document.getElementById("customize-modal");
  const modalItemName = document.getElementById("modal-item-name");
  const modalNotes = document.getElementById("modal-notes");
  const modalCancel = document.getElementById("modal-cancel");
  const modalSave = document.getElementById("modal-save");

  if (!menuGrid) {
    console.error("Tidak menemukan #menu-grid");
    return;
  }

  
  const pageTitle = document.querySelector("h1");
  const thumbImg = document.querySelector(".warung-thumb img");
  if (pageTitle) pageTitle.textContent = warungData.name;
  if (thumbImg) thumbImg.src = warungData.image;


  menuGrid.innerHTML = "";
  warungData.menu.forEach(it => {
    const uid = `${warungData.id}-${it.id}`;
    const itemHtml = document.createElement("div");
    itemHtml.className = "menu-item";
    itemHtml.dataset.id = uid;
    itemHtml.innerHTML = `
      <div class="menu-img-wrap">
        <img src="${it.img}" alt="${it.name}" class="menu-img">
      </div>
      <div class="menu-content">
        <div class="menu-left">
          <h3 class="menu-name">${it.name}</h3>
          <p class="menu-desc">${it.desc || ""}</p>
        </div>
        <div class="menu-right">
          <div class="menu-price">Rp ${parseInt(it.price).toLocaleString('id-ID')}</div>
        </div>
      </div>
      <div class="menu-actions">
        <div class="qty-controls">
          <button class="qty-btn minus">−</button>
          <input class="qty-input" type="number" min="0" value="0">
          <button class="qty-btn plus">+</button>
        </div>
        <div class="action-buttons">
          <button class="btn customize-btn">Customize</button>
          <button class="btn add-btn">Add</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(itemHtml);
  });

  const order = [];

  const getSavedCustomization = (targetId) => {
    if (!modal || modal.dataset.savedFor !== targetId || !modal.dataset.saved) return null;
    try {
      return JSON.parse(modal.dataset.saved);
    } catch (err) {
      console.warn("Gagal membaca catatan kustomisasi:", err);
      return null;
    }
  };

  const items = menuGrid.querySelectorAll(".menu-item");
  items.forEach(item => {
    const id = item.dataset.id;
    const qtyInput = item.querySelector(".qty-input");
    const minus = item.querySelector(".qty-btn.minus");
    const plus = item.querySelector(".qty-btn.plus");
    const customizeBtn = item.querySelector(".customize-btn");
    const addBtn = item.querySelector(".add-btn");
    const name = item.querySelector(".menu-name").textContent.trim();
    const priceText = item.querySelector(".menu-price").textContent.trim();

    plus.addEventListener("click", () => {
      qtyInput.value = Number(qtyInput.value || 0) + 1;
    });
    minus.addEventListener("click", () => {
      qtyInput.value = Math.max(0, Number(qtyInput.value || 0) - 1);
    });

    if (customizeBtn && modal) {
      customizeBtn.addEventListener("click", () => {
        modalItemName.textContent = name;
        modal.dataset.targetId = id;
        const savedData = getSavedCustomization(id);
        modalNotes.value = savedData && savedData.notes ? savedData.notes : "";
        modal.setAttribute("aria-hidden", "false");
      });
    }

    addBtn.addEventListener("click", () => {
      const qty = Math.max(0, Number(qtyInput.value || 0));
      if (qty <= 0) {
        alert("Pilih quantity minimal 1 sebelum menambahkan.");
        return;
      }
      const existingCustomize = getSavedCustomization(id);
      const itemObj = { id, name, price: priceText, qty, customize: existingCustomize || null };

      const sameIndex = order.findIndex(o => o.id === id && JSON.stringify(o.customize) === JSON.stringify(itemObj.customize));
      if (sameIndex > -1) {
        order[sameIndex].qty += qty;
      } else {
        order.push(itemObj);
      }

      qtyInput.value = 0;
      renderOrder();
    });
  });

  if (modal) {
    modalCancel.addEventListener("click", () => {
      modal.setAttribute("aria-hidden", "true");
    });

    modalSave.addEventListener("click", () => {
      const targetId = modal.dataset.targetId;
      if (!targetId) {
        modal.setAttribute("aria-hidden", "true");
        return;
      }
      const notes = modalNotes.value.trim();
      let message = "Catatan tersimpan untuk item ini. Tekan Add untuk menambahkan ke order.";
      if (notes) {
        modal.dataset.savedFor = targetId;
        modal.dataset.saved = JSON.stringify({ notes });
      } else {
        delete modal.dataset.saved;
        delete modal.dataset.savedFor;
        message = "Catatan dikosongkan untuk item ini.";
      }
      modal.setAttribute("aria-hidden", "true");
      alert(message);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.setAttribute("aria-hidden", "true");
    });
  }

  function renderOrder() {
    if (!orderListEl) return;
    orderListEl.innerHTML = "";
    if (order.length === 0) {
      orderListEl.innerHTML = '<p class="muted">Belum ada item.</p>';
      return;
    }
    order.forEach((o, idx) => {
      const div = document.createElement("div");
      div.className = "order-item";
      div.innerHTML = `
        <div>
          <strong>${o.name}</strong>
          ${o.customize && o.customize.notes ? `<div style="font-size:.9rem;color:rgba(0,0,0,.6)">Catatan: ${o.customize.notes}</div>` : ''}
          <div style="font-size:.9rem;color:rgba(0,0,0,.6)">${o.qty} x ${o.price}</div>
        </div>
        <div>
          <button data-idx="${idx}" class="btn ghost remove-item">Remove</button>
        </div>
      `;
      orderListEl.appendChild(div);
    });

    orderListEl.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.dataset.idx);
        order.splice(idx, 1);
        renderOrder();
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!order.length) return;
      if (!confirm("Hapus semua item?")) return;
      order.length = 0;
      renderOrder();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!order.length) {
        alert("Belum ada item di order.");
        return;
      }
      
      // Save order to sessionStorage
      const orderData = {
        warungName: warungData.name,
        items: order
      };
      sessionStorage.setItem('currentOrder', JSON.stringify(orderData));
      
      //Transfer to order page
      window.location.href = 'order.html';
    });
  }

  renderOrder();
});
