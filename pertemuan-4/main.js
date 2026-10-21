const projects = [
    {
        id : 1,
        title : "Sistem Invetaris Keuangan",
        category : "Web App",
        budget : 2500000,
        completed : true
    },
    {
        id : 2,
        title : "Sistem Kasir Digital POS",
        category : "Desktop App",
        budget : 5000000,
        completed : true
    },
    {
        id : 3,
        title : "Landing Page Profil Perusahaan",
        category : "Web App",
        budget : 1500000,
        completed : false
    },
    {
        id : 4,
        title : "Aplikasi Presensi GPS Mobile",
        category : "Mobile App",
        budget : 4500000,
        completed : false
    }
];

const state = {
    category : "Semua",
    search : ""
};

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID',{
        style : 'currency',
        currency : 'IDR',
        maximumFractionDigits : 0
    }).format(angka);
};

const updateStats = (dataList) => {
    const totalProjects = dataList.length;
    const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
    const completedCount = dataList.filter(item => item.completed).length;

document.getElementById("stat-total-projects").textContent = totalProjects;
document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
document.getElementById("stat-completed-projects").textContent = completedCount;
};

const renderProjects = (filteredList) => {
    const container = document.getElementById("project-list");
    if (!container) return;

    if(filteredList.length === 0){
        container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek yang cocok dengan pencarian atau filter.</p>";
        return;
    }

    const htmlString = filteredList.map(proj => {
        const badgeClass = proj.completed ? "badge-success" : "badge-pending";
        const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

        return`
        <div class = "project-card">
        <div class = "project-info">
        <span class = "project-category">${proj.category}</span>
        <h4>${proj.title}</h4>
        <p class = "project-budget">${formatRupiah(proj.budget)}</p>
        </div>
        <div class = "project-actions">
        <span class = "badge ${badgeClass}">${statusText}</span><br>
        <button class = "btn-action" data-action = "toggle" data-id = "${proj.id}">Ubah Status</button>
        <button class = "btn-action hapus" data-action = "delete" data-id = "${proj.id}">Hapus Proyek</button>
        </div>
        </div>
        `;
    }).join("");

    container.innerHTML = htmlString;
};

const getVisibleProjects = () => {
    const keyword = state.search.toLowerCase();

    return projects
        .filter(proj => state.category === "Semua" || proj.category === state.category)
        .filter(proj => proj.title.toLowerCase().includes(keyword));
};

const renderList = () => {
    renderProjects(getVisibleProjects());
};

const renderApp = () => {
    updateStats(projects);
    renderList();
};

document.addEventListener("DOMContentLoaded", () => {
    const projectForm = document.getElementById("project-form");
    const titleInput = document.getElementById("input-title");
    const categoryInput = document.getElementById("input-category");
    const budgetInput = document.getElementById("input-budget");
    const completedInput = document.getElementById("input-completed");
    const formError = document.getElementById("form-error");
    const searchInput = document.getElementById("search-input");
    const projectList = document.getElementById("project-list");
    const filterButtons = document.querySelectorAll(".btn-filter");

    const showFormError = (message) => {
        formError.textContent = message;
        formError.classList.add("show");
    };

    const hideFormError = () => {
        formError.textContent = "";
        formError.classList.remove("show");
    };

    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const budget = Number(budgetInput.value);
        const errors = [];

        if (!title) {
            errors.push("Judul proyek tidak boleh kosong.");
        }

        if (!budgetInput.value || !(budget > 0)) {
            errors.push("Estimasi anggaran harus lebih besar dari 0.");
        }

        if (errors.length > 0) {
            showFormError(errors.join(" "));
            return;
        }

        hideFormError();

        const proyekBaru = {
            id : Date.now(),
            title : title,
            category : categoryInput.value,
            budget : budget,
            completed : completedInput.checked
        };

        projects.push(proyekBaru);
        projectForm.reset();
        renderApp();
    });

    searchInput.addEventListener("input", () => {
        state.search = searchInput.value;
        renderList();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            state.category = e.target.getAttribute("data-category");
            renderList();
        });
    });

    projectList.addEventListener("click", (e) => {
        const actionButton = e.target.closest("button[data-action]");
        if (!actionButton) return;

        const id = Number(actionButton.dataset.id);
        const action = actionButton.dataset.action;

        if (action === "toggle") {
            const proyek = projects.find(item => item.id === id);
            if (!proyek) return;

            proyek.completed = !proyek.completed;
            renderApp();
        }

        if (action === "delete") {
            const index = projects.findIndex(item => item.id === id);
            if (index === -1) return;

            projects.splice(index, 1);
            renderApp();
        }
    });

    renderApp();
});
