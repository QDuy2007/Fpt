const products = [
  {
    id: 1,
    name: "Đặc biệt GNLE",
    cat: ["meat", "special", "spicy"],
    desc: "Salami, ớt chuông, ô liu đen, phô mai mozzarella kéo sợi.",
    price: 289000,
    old: 339000,
    rating: 4.9,
    reviews: 1284,
    badge: "BÁN CHẠY NHẤT",
    discount: "-15%",
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: 2,
    name: "Pepperoni cổ điển",
    cat: ["meat"],
    desc: "Pepperoni giòn cạnh, sốt cà chua San Marzano, oregano.",
    price: 219000,
    old: null,
    rating: 4.8,
    reviews: 962,
    badge: "DOANH THU",
    discount: null,
    img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: 3,
    name: "Gà nướng BBQ",
    cat: ["chicken", "meat"],
    desc: "Gà nướng than, hành đỏ, sốt BBQ hun khói.",
    price: 229000,
    old: 259000,
    rating: 4.8,
    reviews: 856,
    badge: null,
    discount: "-12%",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: 4,
    name: "Người yêu phô mai",
    cat: ["cheese", "veg"],
    desc: "Bốn loại phô mai: mozzarella, gorgonzola, parmesan, cheddar.",
    price: 199000,
    old: null,
    rating: 4.7,
    reviews: 741,
    badge: null,
    discount: null,
    img: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: 5,
    name: "Thịt bò thượng hạng",
    cat: ["meat", "special"],
    desc: "Bò Úc áp chảo, hành caramel, lá rocket tươi.",
    price: 309000,
    old: null,
    rating: 4.9,
    reviews: 612,
    badge: null,
    discount: null,
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: 6,
    name: "Hải sản cao cấp",
    cat: ["seafood"],
    desc: "Tôm sú, vẹm xanh, mực ống, chanh vàng và thì là.",
    price: 279000,
    old: null,
    rating: 4.9,
    reviews: 508,
    badge: null,
    discount: null,
    img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: 7,
    name: "Hawaii",
    cat: ["meat"],
    desc: "Thịt nguội, dứa ngọt, mozzarella và sốt cà chua.",
    price: 209000,
    old: null,
    rating: 4.5,
    reviews: 423,
    badge: null,
    discount: null,
    img: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: 8,
    name: "Kem nấm",
    cat: ["veg", "cheese"],
    desc: "Nấm mỡ, nấm đùi gà, sốt kem truffle, hạt tiêu đen.",
    price: 219000,
    old: null,
    rating: 4.6,
    reviews: 388,
    badge: "MỚI",
    discount: null,
    img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=88",
  },
];

let activeFilter = "all",
  search = "",
  cart = JSON.parse(localStorage.getItem("gonle_cart") || "[]"),
  favorites = new Set(JSON.parse(localStorage.getItem("gonle_fav") || "[]"));

const AUTH_KEY = "gonle_user_session";
const USERS_KEY = "gonle_users";
const seedUsers = [
  {
    name: "Admin GONLEFOOD",
    email: "admin@gonlefood.vn",
    phone: "0900000000",
    password: "123456",
  },
];
let users = JSON.parse(localStorage.getItem(USERS_KEY) || "null");
let currentUser = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");

if (!Array.isArray(users) || users.length === 0) {
  users = seedUsers;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const money = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function renderProducts() {
  const sort = $("#sortSelect").value;
  let list = products.filter(
    (p) =>
      (activeFilter === "all" || p.cat.includes(activeFilter)) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );
  if (sort === "price-low") list.sort((a, b) => a.price - b.price);
  if (sort === "price-high") list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  $("#resultCount").textContent = `${list.length} món phù hợp`;
  $("#productGrid").innerHTML =
    list
      .map(
        (p) => `
    <article class="product-card">
      <div class="product-image" style="background-image:url('${p.img}')">
        ${p.badge ? `<span class="badge"><i class="fa-solid fa-fire"></i> ${p.badge}</span>` : ""}
        ${p.discount ? `<span class="discount">${p.discount}</span>` : ""}
        <button class="fav ${favorites.has(p.id) ? "active" : ""}" onclick="toggleFav(${p.id})"><i class="${favorites.has(p.id) ? "fa-solid" : "fa-regular"} fa-heart"></i></button>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="rating"><i class="fa-solid fa-star"></i> ${p.rating} · ${p.reviews} đánh giá</div>
        <div class="price"><strong>${money(p.price)}</strong>${p.old ? `<del>${money(p.old)}</del>` : ""}</div>
        <div class="product-actions"><button class="add-btn" onclick="addToCart(${p.id})"><i class="fa-solid fa-bag-shopping"></i> Thêm vào giỏ</button><button class="quick-btn" onclick="quickView(${p.id})"><i class="fa-regular fa-eye"></i></button></div>
      </div>
    </article>`,
      )
      .join("") ||
    `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#887c74">Không tìm thấy pizza phù hợp.</div>`;
}

function save() {
  localStorage.setItem("gonle_cart", JSON.stringify(cart));
  localStorage.setItem("gonle_fav", JSON.stringify([...favorites]));
}
function addToCart(id) {
  const p = products.find((x) => x.id === id),
    item = cart.find((x) => x.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  save();
  renderCart();
  openCart();
  toast("Đã thêm " + p.name + " vào giỏ");
}
function changeQty(id, d) {
  const i = cart.find((x) => x.id === id);
  if (!i) return;
  i.qty += d;
  if (i.qty <= 0) cart = cart.filter((x) => x.id !== id);
  save();
  renderCart();
}
function renderCart() {
  $("#cartCount").textContent = cart.reduce((s, x) => s + x.qty, 0);
  $("#cartItems").innerHTML = cart.length
    ? cart
        .map((x) => {
          const p = products.find((y) => y.id === x.id);
          return `<div class="cart-row"><img src="${p.img}"><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="changeQty(${p.id},-${x.qty})"><i class="fa-solid fa-trash"></i></button></div>`;
        })
        .join("")
    : `<p class="empty-cart">Giỏ hàng đang trống. Con người vẫn chưa phát minh ra pizza tự thêm vào giỏ, tiếc thật.</p>`;
  $("#cartTotal").textContent = money(
    cart.reduce(
      (s, x) => s + products.find((p) => p.id === x.id).price * x.qty,
      0,
    ),
  );
}
function toggleFav(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  save();
  renderProducts();
  renderFavorites();
}
function renderFavorites() {
  const list = products.filter((product) => favorites.has(product.id));
  const container = document.querySelector("#favoritesList");
  if (!container) return;

  if (!list.length) {
    container.innerHTML =
      '<div class="empty-favorites">Bạn chưa lưu pizza nào vào danh sách yêu thích.</div>';
    return;
  }

  container.innerHTML = list
    .map(
      (product) => `
        <div class="favorite-item">
          <img src="${product.img}" alt="${product.name}">
          <div class="favorite-info">
            <h3>${product.name}</h3>
            <p>${money(product.price)}</p>
          </div>
          <div class="favorite-actions">
            <button class="outline-btn" onclick="addToCart(${product.id})"><i class="fa-solid fa-bag-shopping"></i> Thêm</button>
            <button class="icon-btn favorite-remove" onclick="toggleFav(${product.id})" title="Bỏ yêu thích"><i class="fa-solid fa-heart-crack"></i></button>
          </div>
        </div>
      `,
    )
    .join("");
}
function openFavorites() {
  renderFavorites();
  document.querySelector("#favoritesModal").classList.add("show");
}
function quickView(id) {
  const p = products.find((x) => x.id === id);
  const ingredients = {
    1: ["Salami", "Ớt chuông", "Ô liu đen", "Mozzarella", "Hành tây"],
    2: ["Pepperoni", "Sốt cà chua", "Mozzarella", "Oregano", "Húng quế"],
    3: ["Gà nướng", "Hành đỏ", "Sốt BBQ", "Phô mai", "Bắp cải"],
    4: ["Mozzarella", "Gorgonzola", "Parmesan", "Cheddar", "Húng quế"],
    5: ["Bò Úc", "Hành caramel", "Rocket", "Parmesan", "Basil"],
    6: ["Tôm sú", "Mực", "Vẹm xanh", "Chanh vàng", "Thì là"],
    7: ["Thịt nguội", "Dứa", "Mozzarella", "Sốt cà chua", "Húng quế"],
    8: ["Nấm mỡ", "Nấm đùi gà", "Sốt kem", "Phô mai", "Hạt tiêu"],
  };

  const detailIngredients = (
    ingredients[p.id] || ["Phô mai", "Sốt", "Nguyên liệu tươi"]
  ).join(" • ");

  $("#modalContent").innerHTML = `
    <div class="quick-product">
      <img src="${p.img}">
      <div class="quick-product-detail">
        <p class="eyebrow">GONLEFOOD · PIZZA</p>
        <h2>${p.name}</h2>
        <div class="rating"><i class="fa-solid fa-star"></i> ${p.rating} · ${p.reviews} đánh giá</div>
        <div class="price"><strong>${money(p.price)}</strong>${p.old ? `<del>${money(p.old)}</del>` : ""}</div>

        <p class="quick-summary">${p.desc}</p>

        <div class="quick-specs">
          <div><span>Độ nóng</span><strong>480°C</strong></div>
          <div><span>Thời gian</span><strong>12–15 phút</strong></div>
          <div><span>Kích thước</span><strong>9–12 inch</strong></div>
        </div>

        <div class="quick-ingredients">
          <h4>Nguyên liệu chính</h4>
          <p>${detailIngredients}</p>
        </div>

        <div class="quick-actions">
          <button class="btn btn-primary" onclick="addToCart(${p.id});closeModal('productModal')">Thêm vào giỏ <i class="fa-solid fa-arrow-right"></i></button>
          <button class="outline-btn" onclick="toggleFav(${p.id});closeModal('productModal')"><i class="fa-regular fa-heart"></i> Yêu thích</button>
        </div>
      </div>
    </div>
  `;
  $("#productModal").classList.add("show");
}
function closeModal(id) {
  $("#" + id).classList.remove("show");
}
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#drawerBackdrop").classList.add("show");
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#drawerBackdrop").classList.remove("show");
}
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
    Object.assign(t.style, {
      position: "fixed",
      left: "50%",
      bottom: "28px",
      transform: "translateX(-50%)",
      background: "#ff6507",
      color: "#180c07",
      padding: "12px 18px",
      borderRadius: "30px",
      font: "700 12px Inter",
      zIndex: 300,
      boxShadow: "0 12px 30px #0005",
    });
  }
  t.textContent = msg;
  t.style.opacity = 1;
  clearTimeout(t._t);
  t._t = setTimeout(() => (t.style.opacity = 0), 1800);
}

$$(".filter").forEach((b) =>
  b.addEventListener("click", () => {
    $$(".filter").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    activeFilter = b.dataset.filter;
    renderProducts();
  }),
);
$("#menuSearch").addEventListener("input", (e) => {
  search = e.target.value;
  renderProducts();
});
$("#headerSearch").addEventListener("input", (e) => {
  search = e.target.value;
  document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  renderProducts();
});
$("#sortSelect").addEventListener("change", renderProducts);
$$(".auth-tab").forEach((tab) =>
  tab.addEventListener("click", () => showAuthTab(tab.dataset.authTab)),
);
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#drawerBackdrop").addEventListener("click", closeCart);
$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return toast("Giỏ hàng đang trống");
  closeCart();
  $("#checkoutModal").classList.add("show");
});
$$("[data-close]").forEach((b) =>
  b.addEventListener("click", () => closeModal(b.dataset.close)),
);
$$(".modal").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("show");
  }),
);
function showAuthTab(tab) {
  $$(".auth-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.authTab === tab);
  });
  $$(".auth-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.authPanel === tab);
  });
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function openAuthModal(tab = "login") {
  showAuthTab(tab);
  $("#authModal").classList.add("show");
}

function closeAuthModal() {
  closeModal("authModal");
}

function handleLoginSuccess(user) {
  currentUser = { name: user.name, email: user.email };
  localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
  toast(`Chào mừng ${user.name}`);
  closeAuthModal();
}

$("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value.trim();
  const user = users.find(
    (item) => item.email.toLowerCase() === email && item.password === password,
  );

  if (!user) {
    $("#loginNote").textContent = "Email hoặc mật khẩu không đúng.";
    return;
  }

  $("#loginNote").textContent = "Đăng nhập thành công.";
  e.target.reset();
  handleLoginSuccess(user);
});

$("#registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#registerName").value.trim();
  const email = $("#registerEmail").value.trim().toLowerCase();
  const phone = $("#registerPhone").value.trim();
  const password = $("#registerPassword").value.trim();

  if (!name || !email || !phone || !password) {
    $("#registerNote").textContent = "Vui lòng điền đầy đủ thông tin.";
    return;
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    $("#registerNote").textContent = "Email này đã được đăng ký.";
    return;
  }

  users.push({ name, email, phone, password });
  saveUsers();
  $("#registerNote").textContent =
    "Đăng ký thành công. Bạn có thể đăng nhập ngay.";
  $("#registerForm").reset();
  showAuthTab("login");
  $("#loginEmail").value = email;
});

$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#formNote").textContent =
    "Đã nhận tin nhắn. GONLEFOOD sẽ liên hệ với bạn sớm.";
  e.target.reset();
});
$("#signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#signupNote").textContent =
    "Đăng ký thành công. Chúng tôi sẽ gửi ưu đãi và thông tin mới nhất cho bạn.";
  e.target.reset();
});
$("#checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  cart = [];
  save();
  renderCart();
  closeModal("checkoutModal");
  toast(
    "Đặt hàng thành công · Mã đơn GNLE-" +
      Math.floor(1000 + Math.random() * 8999),
  );
});
$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("Đăng ký nhận bản tin thành công");
});
$$(".coupon").forEach((b) =>
  b.addEventListener("click", async () => {
    await navigator.clipboard?.writeText(b.dataset.code);
    toast("Đã sao chép mã " + b.dataset.code);
  }),
);
$$(".demo-codes button").forEach((b) =>
  b.addEventListener("click", () => {
    $("#orderInput").value = b.dataset.order;
    trackOrder();
  }),
);

const orderDatabase = {
  "GNLE-2481": {
    status: "Đang giao",
    eta: "19:04",
    driver: "Trần Minh Quân",
    total: "777.000đ",
    summary: "2× Đặc biệt GNLE · 1× Người yêu phô mai · 2× Coca lạnh",
    address: "128 Nguyễn Huệ, Quận 1",
    progress: 78,
    steps: [
      {
        label: "Đã xác nhận",
        time: "18:24",
        text: "GONLEFOOD đã nhận đơn và xác nhận thanh toán.",
        done: true,
      },
      {
        label: "Chuẩn bị",
        time: "18:31",
        text: "Nhào bột ủ 24 giờ, phết sốt và rải nguyên liệu tươi.",
        done: true,
      },
      {
        label: "Nướng",
        time: "18:39",
        text: "Vào lò than củi 480°C, chín trong đúng 90 giây.",
        done: true,
      },
      {
        label: "Đang giao",
        time: "18:52",
        text: "Tài xế đang trên đường tới địa chỉ của bạn.",
        done: true,
        current: true,
      },
      {
        label: "Đã giao",
        time: "Dự kiến 19:04",
        text: "Giao tận tay. Chúc bạn ngon miệng!",
        done: false,
      },
    ],
  },
  "GNLE-1042": {
    status: "Đang chuẩn bị",
    eta: "18:50",
    driver: "Lê Hoàng Nam",
    total: "459.000đ",
    summary: "1× Gà nướng BBQ · 1× Hawaii · 2× Nước cam",
    address: "12 Lê Lợi, Quận 3",
    progress: 52,
    steps: [
      {
        label: "Đã xác nhận",
        time: "17:50",
        text: "Đơn hàng đã được xác nhận và thanh toán.",
        done: true,
      },
      {
        label: "Chuẩn bị",
        time: "17:58",
        text: "Bột đang được nhào và nguyên liệu được rải đều.",
        done: true,
        current: true,
      },
      {
        label: "Nướng",
        time: "18:18",
        text: "Đang đưa bánh vào lò than 480°C.",
        done: false,
      },
      {
        label: "Đang giao",
        time: "Chờ tài xế",
        text: "Đơn sẽ được giao sau khi nướng xong.",
        done: false,
      },
      {
        label: "Đã giao",
        time: "Dự kiến 18:50",
        text: "Nhà hàng sẽ gọi xác nhận trước khi giao.",
        done: false,
      },
    ],
  },
  "GNLE-3050": {
    status: "Đang nướng",
    eta: "20:10",
    driver: "Nguyễn Duy Khánh",
    total: "629.000đ",
    summary: "1× Hải sản cao cấp · 1× Người yêu phô mai · 1× Coca",
    address: "88 Pasteur, Quận 1",
    progress: 66,
    steps: [
      {
        label: "Đã xác nhận",
        time: "19:10",
        text: "Đơn hàng đã được thanh toán và xác nhận.",
        done: true,
      },
      {
        label: "Chuẩn bị",
        time: "19:18",
        text: "Đang chuẩn bị nguyên liệu và bột.",
        done: true,
      },
      {
        label: "Nướng",
        time: "19:40",
        text: "Pizza đang trong lò than với nhiệt độ tối ưu.",
        done: true,
        current: true,
      },
      {
        label: "Đang giao",
        time: "Chờ hoàn tất",
        text: "Đơn sẽ giao sau khi bánh hoàn tất.",
        done: false,
      },
      {
        label: "Đã giao",
        time: "Dự kiến 20:10",
        text: "Tài xế sẽ gọi trước khi tới chỗ bạn.",
        done: false,
      },
    ],
  },
  "GNLE-7777": {
    status: "Đã giao",
    eta: "Đã giao lúc 17:40",
    driver: "Phạm Quốc Anh",
    total: "1.150.000đ",
    summary: "2× Đặc biệt GNLE · 1× Thịt bò thượng hạng · 1× Combo gia đình",
    address: "30 Trần Hưng Đạo, Quận 5",
    progress: 100,
    steps: [
      {
        label: "Đã xác nhận",
        time: "16:25",
        text: "Đơn đã được xác nhận và thanh toán.",
        done: true,
      },
      {
        label: "Chuẩn bị",
        time: "16:32",
        text: "Bánh được chuẩn bị đúng theo yêu cầu.",
        done: true,
      },
      {
        label: "Nướng",
        time: "16:44",
        text: "Đã hoàn tất nướng và kiểm tra chất lượng.",
        done: true,
      },
      {
        label: "Đang giao",
        time: "17:05",
        text: "Tài xế đã mang bánh đến địa chỉ giao.",
        done: true,
      },
      {
        label: "Đã giao",
        time: "17:40",
        text: "Bánh đã giao thành công và chúc bạn ngon miệng!",
        done: true,
        current: true,
      },
    ],
  },
};

function renderOrderTracking(code) {
  const order = orderDatabase[code];
  if (!order) {
    toast("Mã đơn hàng không tồn tại");
    return false;
  }

  $("#orderId").textContent = code;
  $("#orderStatus").textContent = order.status;
  $("#orderEta").textContent = order.eta;
  $("#orderDriver").textContent = order.driver;
  $("#orderTotal").textContent = order.total;
  $("#orderSummary").innerHTML =
    `<i class="fa-solid fa-box"></i> ${order.summary}`;
  $("#orderAddress").innerHTML =
    `<i class="fa-solid fa-location-dot"></i> ${order.address}`;
  $("#orderProgress").style.width = `${order.progress}%`;

  const steps = [...document.querySelectorAll("#orderSteps > div")];
  steps.forEach((step, index) => {
    const item = order.steps[index];
    if (!item) return;

    const isDone = item.done;
    const isCurrent = Boolean(item.current);
    step.classList.toggle("done", isDone);
    step.classList.toggle("current", isCurrent);
    step.innerHTML = `
      <i class="${isDone ? "fa-solid fa-check" : isCurrent ? "fa-solid fa-motorcycle" : "fa-solid fa-circle"}"></i>
      <b>${item.label}</b>
      <small>${item.time}</small>
      <p>${item.text}</p>
    `;
  });

  $("#orderCard").style.animation = "fadeUp .5s both";
  toast("Đã tra cứu " + code);
  return true;
}

function trackOrder() {
  const code = $("#orderInput").value.trim().toUpperCase();
  if (!code) return toast("Nhập mã đơn hàng trước");
  renderOrderTracking(code);
}

$("#trackBtn").addEventListener("click", trackOrder);
$("#mobileMenu").addEventListener("click", () =>
  $(".nav").classList.toggle("open"),
);
$("#accountBtn").addEventListener("click", () => {
  openAuthModal(currentUser ? "login" : "login");
  if (currentUser) {
    $("#loginNote").textContent = `Bạn đang đăng nhập với ${currentUser.email}`;
  }
});
$("#favoritesBtn").addEventListener("click", () => {
  search = "";
  activeFilter = "all";
  renderProducts();
  openFavorites();
  toast(`${favorites.size} sản phẩm đang được yêu thích`);
});
const deadline = Date.now() + 1000 * 60 * 60 * 126;
setInterval(() => {
  let d = Math.max(0, deadline - Date.now()),
    sec = Math.floor(d / 1000);
  $("#days").textContent = String(Math.floor(sec / 86400)).padStart(2, "0");
  sec %= 86400;
  $("#hours").textContent = String(Math.floor(sec / 3600)).padStart(2, "0");
  sec %= 3600;
  $("#minutes").textContent = String(Math.floor(sec / 60)).padStart(2, "0");
  $("#seconds").textContent = String(sec % 60).padStart(2, "0");
}, 1000);
window.addEventListener("scroll", () => {
  $("#header").classList.toggle("scrolled", scrollY > 30);
  $("#backTop").classList.toggle("show", scrollY > 600);
});
$("#backTop").addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" }),
);
renderProducts();
renderCart();
renderFavorites();
