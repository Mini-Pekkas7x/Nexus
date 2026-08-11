console.log("NEXUS — Projetos iniciado!");

// =================================
// CONFIGURAÇÃO DA API
// =================================

const API_URL =
    "http://localhost:3000/api/projetos";

// =================================
// ELEMENTOS
// =================================

const newProjectButton =
    document.getElementById("new-project-button");

const modal =
    document.getElementById("project-modal");

const closeModal =
    document.getElementById("close-project-modal");

const cancelProject =
    document.getElementById("cancel-project");

const projectForm =
    document.getElementById("project-form");

const projectsContainer =
    document.getElementById("projects-container");

const searchProjects =
    document.getElementById("search-projects");

const filterProjectStatus =
    document.getElementById("filter-project-status");

const progressInput =
    document.getElementById("project-progress");

const progressValue =
    document.getElementById("progress-value");

// =================================
// DADOS
// =================================

let projects = [];

// =================================
// ABRIR MODAL — NOVO PROJETO
// =================================

function openProjectModal() {

    document.getElementById(
        "project-modal-title"
    ).textContent = "Novo projeto";

    projectForm.reset();

    document.getElementById(
        "project-id"
    ).value = "";

    // Status padrão

    document.getElementById(
        "project-status"
    ).value = "planning";

    // Progresso padrão

    progressInput.value = 0;

    progressValue.textContent = "0%";

    modal.classList.remove("hidden");
}

// =================================
// FECHAR MODAL
// =================================

function closeProjectModal() {

    modal.classList.add("hidden");

    projectForm.reset();

    document.getElementById(
        "project-id"
    ).value = "";

    progressInput.value = 0;

    progressValue.textContent = "0%";
}

// =================================
// EVENTOS DOS BOTÕES
// =================================

if (newProjectButton) {

    newProjectButton.addEventListener(
        "click",
        openProjectModal
    );
}

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeProjectModal
    );
}

if (cancelProject) {

    cancelProject.addEventListener(
        "click",
        closeProjectModal
    );
}

// =================================
// ATUALIZAR PROGRESSO
// =================================

if (progressInput) {

    progressInput.addEventListener(
        "input",
        function () {

            progressValue.textContent =
                `${progressInput.value}%`;

        }
    );
}

// =================================
// CARREGAR PROJETOS
// =================================

async function loadProjects() {

    try {

        const response =
            await fetch(API_URL);

        const result =
            await response.json();

        console.log(
            "Resposta da API:",
            result
        );

        if (
            !response.ok ||
            !result.sucesso
        ) {

            throw new Error(
                result.erro ||
                result.mensagem ||
                "Erro ao carregar projetos."
            );

        }

        projects =
            result.projetos || [];

        renderProjects();

    } catch (error) {

        console.error(
            "Erro ao carregar projetos:",
            error
        );

        projectsContainer.innerHTML = `

            <div class="project-empty">

                <div>
                    ⚠️
                </div>

                <h3>
                    Não foi possível carregar
                </h3>

                <p>
                    Verifique se o backend do NEXUS está funcionando.
                </p>

            </div>

        `;
    }
}

// =================================
// SALVAR PROJETO
// =================================

projectForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const id =
            document.getElementById(
                "project-id"
            ).value;

        const title =
            document.getElementById(
                "project-title"
            ).value.trim();

        const status =
            document.getElementById(
                "project-status"
            ).value;

        const description =
            document.getElementById(
                "project-description"
            ).value.trim();

        const progress =
            Number(
                document.getElementById(
                    "project-progress"
                ).value
            );

        // =================================
        // VALIDAR
        // =================================

        if (
            !title ||
            !description
        ) {

            alert(
                "Preencha o nome e a descrição do projeto."
            );

            return;
        }

        try {

            let response;

            // =================================
            // EDITAR
            // =================================

            if (id) {

                response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    title:
                                        title,

                                    description:
                                        description,

                                    status:
                                        status,

                                    progress:
                                        progress

                                })

                        }
                    );

            }

            // =================================
            // CRIAR
            // =================================

            else {

                response =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    title:
                                        title,

                                    description:
                                        description,

                                    status:
                                        status,

                                    progress:
                                        progress

                                })

                        }
                    );
            }

            const result =
                await response.json();

            console.log(
                "Resposta ao salvar:",
                result
            );

            if (
                !response.ok ||
                !result.sucesso
            ) {

                throw new Error(
                    result.erro ||
                    result.mensagem ||
                    "Erro ao salvar projeto."
                );
            }

            closeProjectModal();

            await loadProjects();

            alert(
                id
                    ? "Projeto atualizado! ✏️"
                    : "Projeto criado! 🚀"
            );

        } catch (error) {

            console.error(
                "Erro ao salvar projeto:",
                error
            );

            alert(
                error.message ||
                "Não foi possível salvar o projeto."
            );
        }

    }
);

// =================================
// RENDERIZAR PROJETOS
// =================================

function renderProjects() {

    const search =
        searchProjects
            ? searchProjects.value
                .toLowerCase()
                .trim()
            : "";

    const statusFilter =
        filterProjectStatus
            ? filterProjectStatus.value
            : "all";

    let filteredProjects =
        projects.filter(
            function (project) {

                const title =
                    project.title || "";

                const description =
                    project.description || "";

                const matchesSearch =
                    title
                        .toLowerCase()
                        .includes(search)
                    ||
                    description
                        .toLowerCase()
                        .includes(search);

                const matchesStatus =
                    statusFilter === "all"
                    ||
                    project.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

    // =================================
    // MAIS RECENTES PRIMEIRO
    // =================================

    filteredProjects.sort(
        function (a, b) {

            const dateA =
                new Date(
                    a.updated_at ||
                    a.created_at ||
                    0
                );

            const dateB =
                new Date(
                    b.updated_at ||
                    b.created_at ||
                    0
                );

            return dateB - dateA;
        }
    );

    projectsContainer.innerHTML = "";

    // =================================
    // NENHUM PROJETO
    // =================================

    if (
        filteredProjects.length === 0
    ) {

        projectsContainer.innerHTML = `

            <div class="project-empty">

                <div>
                    🚀
                </div>

                <h3>
                    Nenhum projeto encontrado
                </h3>

                <p>
                    Crie um projeto ou tente outra pesquisa.
                </p>

            </div>

        `;

        return;
    }

    // =================================
    // CARDS
    // =================================

    filteredProjects.forEach(
        function (project) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "project-card";

            const progress =
                Number(
                    project.progress || 0
                );

            card.innerHTML = `

                <div class="project-card-header">

                    <div class="project-icon">
                        🚀
                    </div>

                    <div class="project-actions">

                        <button
                            type="button"
                            onclick="editProject('${project.id}')"
                            title="Editar"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            onclick="deleteProject('${project.id}')"
                            title="Excluir"
                        >
                            🗑️
                        </button>

                    </div>

                </div>


                <h3>
                    ${escapeHTML(
                        project.title
                    )}
                </h3>


                <span class="project-status ${getStatusClass(project.status)}">
                    ${getStatusLabel(project.status)}
                </span>


                <p class="project-description">
                    ${escapeHTML(
                        project.description || ""
                    )}
                </p>


                <div class="project-progress">

                    <div class="project-progress-header">

                        <span>
                            Progresso
                        </span>

                        <strong>
                            ${progress}%
                        </strong>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress-bar-fill"
                            style="width: ${progress}%"
                        ></div>

                    </div>

                </div>


                <div class="project-footer">

                    <span>
                        📅
                        ${formatDate(
                            project.created_at
                        )}
                    </span>

                </div>

            `;

            projectsContainer.appendChild(
                card
            );
        }
    );
}

// =================================
// EDITAR PROJETO
// =================================

function editProject(id) {

    const project =
        projects.find(
            function (project) {

                return String(
                    project.id
                ) === String(id);

            }
        );

    if (!project) {

        return;
    }

    document.getElementById(
        "project-modal-title"
    ).textContent =
        "Editar projeto";

    document.getElementById(
        "project-id"
    ).value =
        project.id;

    document.getElementById(
        "project-title"
    ).value =
        project.title || "";

    document.getElementById(
        "project-status"
    ).value =
        project.status || "planning";

    document.getElementById(
        "project-description"
    ).value =
        project.description || "";

    const progress =
        Number(
            project.progress || 0
        );

    document.getElementById(
        "project-progress"
    ).value =
        progress;

    progressValue.textContent =
        `${progress}%`;

    modal.classList.remove(
        "hidden"
    );
}

// =================================
// EXCLUIR PROJETO
// =================================

async function deleteProject(id) {

    const project =
        projects.find(
            function (project) {

                return String(
                    project.id
                ) === String(id);

            }
        );

    if (!project) {

        return;
    }

    const confirmDelete =
        confirm(
            `Deseja realmente excluir "${project.title}"?`
        );

    if (!confirmDelete) {

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE"

                }
            );

        const result =
            await response.json();

        console.log(
            "Resposta ao excluir:",
            result
        );

        if (
            !response.ok ||
            !result.sucesso
        ) {

            throw new Error(
                result.erro ||
                result.mensagem ||
                "Erro ao excluir projeto."
            );
        }

        await loadProjects();

        alert(
            "Projeto excluído! 🗑️"
        );

    } catch (error) {

        console.error(
            "Erro ao excluir projeto:",
            error
        );

        alert(
            error.message ||
            "Não foi possível excluir o projeto."
        );
    }
}

// =================================
// PESQUISA
// =================================

if (searchProjects) {

    searchProjects.addEventListener(
        "input",
        renderProjects
    );
}

// =================================
// FILTRO DE STATUS
// =================================

if (filterProjectStatus) {

    filterProjectStatus.addEventListener(
        "change",
        renderProjects
    );
}

// =================================
// FORMATAR DATA
// =================================

function formatDate(date) {

    if (!date) {

        return "";
    }

    return new Date(
        date
    ).toLocaleDateString(
        "pt-BR"
    );
}

// =================================
// STATUS
// =================================

function getStatusLabel(status) {

    switch (status) {

        case "planning":
            return "📋 Planejamento";

        case "progress":
            return "🟡 Em andamento";

        case "completed":
            return "🟢 Concluído";

        case "paused":
            return "⏸️ Pausado";

        default:
            return "📋 Planejamento";
    }
}

function getStatusClass(status) {

    switch (status) {

        case "planning":
            return "status-planning";

        case "progress":
            return "status-progress";

        case "completed":
            return "status-completed";

        case "paused":
            return "status-paused";

        default:
            return "status-planning";
    }
}

// =================================
// SEGURANÇA
// =================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;
}

// =================================
// INICIAR
// =================================

loadProjects();

// =================================
// ABRIR PELO DASHBOARD
// =================================

const params =
    new URLSearchParams(
        window.location.search
    );

if (
    params.get("novo") === "true"
) {

    if (newProjectButton) {

        newProjectButton.click();
    }
}

// =================================
// EXPOR FUNÇÕES
// =================================

window.editProject =
    editProject;

window.deleteProject =
    deleteProject;