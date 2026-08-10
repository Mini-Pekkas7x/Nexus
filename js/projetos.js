console.log("NEXUS — Projetos iniciado!");


// =============================
// ELEMENTOS
// =============================

const newProjectButton =
    document.getElementById("new-project-button");

const projectModal =
    document.getElementById("project-modal");

const closeProjectModal =
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


// =============================
// DADOS
// =============================

let projects =
    NexusStorage.buscar("projetos");


// =============================
// ABRIR MODAL
// =============================

newProjectButton.addEventListener(
    "click",
    function () {

        document.getElementById(
            "project-modal-title"
        ).textContent = "Novo projeto";

        projectForm.reset();

        document.getElementById(
            "project-id"
        ).value = "";

        progressInput.value = 0;

        progressValue.textContent = "0%";

        projectModal.classList.remove("hidden");

    }
);


// =============================
// FECHAR MODAL
// =============================

closeProjectModal.addEventListener(
    "click",
    function () {

        projectModal.classList.add("hidden");

    }
);


cancelProject.addEventListener(
    "click",
    function () {

        projectModal.classList.add("hidden");

    }
);


// =============================
// PROGRESSO
// =============================

progressInput.addEventListener(
    "input",
    function () {

        progressValue.textContent =
            `${progressInput.value}%`;

    }
);


// =============================
// SALVAR PROJETO
// =============================

projectForm.addEventListener(
    "submit",
    function (event) {

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


        const startDate =
            document.getElementById(
                "project-start"
            ).value;


        const deadline =
            document.getElementById(
                "project-deadline"
            ).value;


        const progress =
            Number(
                document.getElementById(
                    "project-progress"
                ).value
            );


        if (
            !title ||
            !description
        ) {

            alert(
                "Preencha o nome e a descrição do projeto."
            );

            return;

        }


        // =============================
        // EDITAR
        // =============================

        if (id) {

            const project =
                projects.find(
                    function (project) {

                        return project.id === id;

                    }
                );


            if (project) {

                project.title =
                    title;

                project.status =
                    status;

                project.description =
                    description;

                project.startDate =
                    startDate;

                project.deadline =
                    deadline;

                project.progress =
                    progress;

                project.updatedAt =
                    new Date().toISOString();

            }

        }


        // =============================
        // CRIAR
        // =============================

        else {

            const newProject = {

                id:
                    crypto.randomUUID(),

                title:
                    title,

                status:
                    status,

                description:
                    description,

                startDate:
                    startDate,

                deadline:
                    deadline,

                progress:
                    progress,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };


            projects.unshift(
                newProject
            );

        }


        // =============================
        // SALVAR
        // =============================

        NexusStorage.salvar(
            "projetos",
            projects
        );


        projectForm.reset();

        document.getElementById(
            "project-id"
        ).value = "";

        progressInput.value = 0;

        progressValue.textContent = "0%";

        projectModal.classList.add("hidden");


        renderProjects();

    }
);


// =============================
// RENDERIZAR PROJETOS
// =============================

function renderProjects() {

    const search =
        searchProjects.value
            .toLowerCase()
            .trim();


    const statusFilter =
        filterProjectStatus.value;


    let filteredProjects =
        projects.filter(
            function (project) {

                const matchesSearch =
                    project.title
                        .toLowerCase()
                        .includes(search)
                    ||
                    project.description
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


    // Mais recentes primeiro

    filteredProjects.sort(
        function (a, b) {

            const dateA =
                new Date(
                    a.updatedAt ||
                    a.createdAt
                );

            const dateB =
                new Date(
                    b.updatedAt ||
                    b.createdAt
                );

            return dateB - dateA;

        }
    );


    projectsContainer.innerHTML = "";


    // =============================
    // NENHUM PROJETO
    // =============================

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


    // =============================
    // CARDS
    // =============================

    filteredProjects.forEach(
        function (project) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "project-card";


            const statusInfo =
                getStatusInfo(
                    project.status
                );


            card.innerHTML = `

                <div class="project-card-header">

                    <h3>
                        ${escapeHTML(
                            project.title
                        )}
                    </h3>

                    <span
                        class="project-status ${project.status}"
                    >
                        ${statusInfo.label}
                    </span>

                </div>


                <p class="project-description">

                    ${escapeHTML(
                        project.description
                    )}

                </p>


                <div class="project-progress">

                    <div class="project-progress-header">

                        <span>
                            Progresso
                        </span>

                        <strong>
                            ${project.progress}%
                        </strong>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress-bar-fill"
                            style="width: ${project.progress}%"
                        ></div>

                    </div>

                </div>


                <div class="project-dates-info">

                    <span>
                        📅 Início:
                        ${formatDate(
                            project.startDate
                        )}
                    </span>

                    <span>
                        🏁 Prazo:
                        ${formatDate(
                            project.deadline
                        )}
                    </span>

                </div>


                <div class="project-card-footer">

                    <span></span>

                    <div class="project-actions">

                        <button
                            onclick="editProject('${project.id}')"
                            title="Editar"
                        >
                            ✏️
                        </button>


                        <button
                            onclick="deleteProject('${project.id}')"
                            title="Excluir"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;


            projectsContainer.appendChild(
                card
            );

        }
    );

}


// =============================
// STATUS
// =============================

function getStatusInfo(status) {

    const statuses = {

        planning: {
            label: "📋 Planejamento"
        },

        progress: {
            label: "🟡 Em andamento"
        },

        completed: {
            label: "🟢 Concluído"
        },

        paused: {
            label: "⏸️ Pausado"
        }

    };


    return (
        statuses[status] ||
        statuses.planning
    );

}


// =============================
// EDITAR
// =============================

function editProject(id) {

    const project =
        projects.find(
            function (project) {

                return project.id === id;

            }
        );


    if (!project) return;


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
        project.title;


    document.getElementById(
        "project-status"
    ).value =
        project.status;


    document.getElementById(
        "project-description"
    ).value =
        project.description;


    document.getElementById(
        "project-start"
    ).value =
        project.startDate || "";


    document.getElementById(
        "project-deadline"
    ).value =
        project.deadline || "";


    progressInput.value =
        project.progress || 0;


    progressValue.textContent =
        `${project.progress || 0}%`;


    projectModal.classList.remove(
        "hidden"
    );

}


// =============================
// EXCLUIR
// =============================

function deleteProject(id) {

    const confirmDelete =
        confirm(
            "Deseja realmente excluir este projeto?"
        );


    if (!confirmDelete) return;


    projects =
        projects.filter(
            function (project) {

                return project.id !== id;

            }
        );


    NexusStorage.salvar(
        "projetos",
        projects
    );


    renderProjects();

}


// =============================
// PESQUISA
// =============================

searchProjects.addEventListener(
    "input",
    renderProjects
);


filterProjectStatus.addEventListener(
    "change",
    renderProjects
);


// =============================
// UTILIDADES
// =============================

function formatDate(date) {

    if (!date) {

        return "Não definida";

    }


    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );

}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =============================
// INICIAR
// =============================

renderProjects();

// =============================
// ABRIR MODAL PELO DASHBOARD
// =============================

const params =
    new URLSearchParams(
        window.location.search
    );


if (params.get("novo") === "true") {

    document.getElementById(
        "project-modal-title"
    ).textContent =
        "Novo projeto";


    projectForm.reset();


    document.getElementById(
        "project-id"
    ).value = "";


    progressInput.value = 0;

    progressValue.textContent =
        "0%";


    projectModal.classList.remove(
        "hidden"
    );

}