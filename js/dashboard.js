console.log("NEXUS — Dashboard iniciado!");

// =================================
// CONFIGURAÇÃO DA API
// =================================

const API_BASE_URL =
    "http://localhost:3000/api";

// =================================
// ELEMENTOS
// =================================

const notesCount =
    document.getElementById("notes-count");

const recentNotes =
    document.getElementById("recent-notes");

const achievementsCount =
    document.getElementById("achievements-count");

const recentAchievements =
    document.getElementById("recent-achievements");

const projectsCount =
    document.getElementById("projects-count");

const birthdaysCount =
    document.getElementById("birthdays-count");

const projectsInProgress =
    document.getElementById("projects-in-progress");

const projectsCompleted =
    document.getElementById("projects-completed");

const recentProjects =
    document.getElementById("recent-projects");

const dashboardBirthdays =
    document.getElementById("dashboard-birthdays");

// =================================
// DADOS
// =================================

let notes = [];
let achievements = [];
let projects = [];
let birthdays = [];

// =================================
// ESCAPE HTML
// =================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;
}

// =================================
// CARREGAR DADOS DA API
// =================================

async function loadDashboardData() {

    try {

        console.log(
            "Carregando dados do dashboard..."
        );

        const [
            notesResponse,
            achievementsResponse,
            projectsResponse,
            birthdaysResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/notas`
            ),

            fetch(
                `${API_BASE_URL}/conquistas`
            ),

            fetch(
                `${API_BASE_URL}/projetos`
            ),

            fetch(
                `${API_BASE_URL}/aniversariantes`
            )

        ]);


        // =================================
        // VERIFICAR RESPOSTAS
        // =================================

        if (
            !notesResponse.ok ||
            !achievementsResponse.ok ||
            !projectsResponse.ok ||
            !birthdaysResponse.ok
        ) {

            throw new Error(
                "Erro ao carregar dados da API."
            );

        }


        // =================================
        // CONVERTER JSON
        // =================================

        const notesResult =
            await notesResponse.json();

        const achievementsResult =
            await achievementsResponse.json();

        const projectsResult =
            await projectsResponse.json();

        const birthdaysResult =
            await birthdaysResponse.json();


        console.log(
            "Notas:",
            notesResult
        );

        console.log(
            "Conquistas:",
            achievementsResult
        );

        console.log(
            "Projetos:",
            projectsResult
        );

        console.log(
            "Aniversariantes:",
            birthdaysResult
        );


        // =================================
        // SALVAR DADOS
        // =================================

        notes =
            notesResult.notas || [];

        achievements =
            achievementsResult.conquistas || [];

        projects =
            projectsResult.projetos || [];

        birthdays =
            birthdaysResult.aniversariantes || [];


        // =================================
        // ATUALIZAR CONTADORES
        // =================================

        updateCounters();


        // =================================
        // RENDERIZAR
        // =================================

        renderRecentNotes();

        renderRecentAchievements();

        renderRecentProjects();

        renderDashboardBirthdays();


    } catch (error) {

        console.error(
            "Erro ao carregar dashboard:",
            error
        );

    }

}

// =================================
// CONTADORES
// =================================

function updateCounters() {

    // Notas

    if (notesCount) {

        notesCount.textContent =
            notes.length;

    }


    // Conquistas

    if (achievementsCount) {

        achievementsCount.textContent =
            achievements.length;

    }


    // Projetos

    if (projectsCount) {

        projectsCount.textContent =
            projects.length;

    }


    // Aniversariantes

    if (birthdaysCount) {

        birthdaysCount.textContent =
            birthdays.length;

    }


    // =================================
    // PROJETOS EM ANDAMENTO
    // =================================

    const inProgress =
        projects.filter(
            function (project) {

                return (
                    project.status ===
                    "progress"
                );

            }
        ).length;


    if (projectsInProgress) {

        projectsInProgress.textContent =
            inProgress;

    }


    // =================================
    // PROJETOS CONCLUÍDOS
    // =================================

    const completed =
        projects.filter(
            function (project) {

                return (
                    project.status ===
                    "completed"
                );

            }
        ).length;


    if (projectsCompleted) {

        projectsCompleted.textContent =
            completed;

    }

}

// =================================
// NOTAS RECENTES
// =================================

function renderRecentNotes() {

    if (!recentNotes) {
        return;
    }


    recentNotes.innerHTML = "";


    if (notes.length === 0) {

        recentNotes.innerHTML = `

            <div class="dashboard-empty">

                <div>
                    📝
                </div>

                <p>
                    Nenhuma nota ainda.
                </p>

            </div>

        `;

        return;

    }


    const sortedNotes =
        [...notes].sort(
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


    const latestNotes =
        sortedNotes.slice(0, 3);


    latestNotes.forEach(
        function (note) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "dashboard-note";


            item.innerHTML = `

                <div class="dashboard-note-icon">
                    📝
                </div>

                <div class="dashboard-note-info">

                    <strong>
                        ${escapeHTML(
                            note.title
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            note.category
                        )}
                    </span>

                </div>

            `;


            recentNotes.appendChild(
                item
            );

        }
    );

}

// =================================
// CONQUISTAS RECENTES
// =================================

function renderRecentAchievements() {

    if (!recentAchievements) {
        return;
    }


    recentAchievements.innerHTML =
        "";


    if (achievements.length === 0) {

        recentAchievements.innerHTML = `

            <div class="dashboard-empty">

                <div>
                    🏆
                </div>

                <p>
                    Nenhuma conquista ainda.
                </p>

            </div>

        `;

        return;

    }


    const sortedAchievements =
        [...achievements].sort(
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


    const latestAchievements =
        sortedAchievements.slice(
            0,
            3
        );


    latestAchievements.forEach(
        function (achievement) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "dashboard-achievement";


            item.innerHTML = `

                <div class="dashboard-achievement-icon">
                    🏆
                </div>

                <div class="dashboard-achievement-info">

                    <strong>
                        ${escapeHTML(
                            achievement.title
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            achievement.category
                        )}
                    </span>

                </div>

            `;


            recentAchievements.appendChild(
                item
            );

        }
    );

}

// =================================
// PROJETOS RECENTES
// =================================

function renderRecentProjects() {

    if (!recentProjects) {
        return;
    }


    recentProjects.innerHTML = "";


    if (projects.length === 0) {

        recentProjects.innerHTML = `

            <div class="dashboard-empty">

                <div>
                    🚀
                </div>

                <p>
                    Nenhum projeto ainda.
                </p>

            </div>

        `;

        return;

    }


    const sortedProjects =
        [...projects].sort(
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


    const latestProjects =
        sortedProjects.slice(
            0,
            3
        );


    latestProjects.forEach(
        function (project) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "dashboard-project";


            const statusInfo =
                getProjectStatus(
                    project.status
                );


            const progress =
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(
                            project.progress
                        ) || 0
                    )
                );


            item.innerHTML = `

                <div class="dashboard-project-icon">
                    🚀
                </div>

                <div class="dashboard-project-info">

                    <div class="dashboard-project-title">

                        <strong>
                            ${escapeHTML(
                                project.title
                            )}
                        </strong>

                        <span class="dashboard-project-status">
                            ${statusInfo}
                        </span>

                    </div>


                    <div class="dashboard-project-progress">

                        <div class="dashboard-project-progress-bar">

                            <div
                                style="width: ${progress}%"
                            ></div>

                        </div>


                        <span>
                            ${progress}%
                        </span>

                    </div>

                </div>

            `;


            recentProjects.appendChild(
                item
            );

        }
    );

}

// =================================
// STATUS DO PROJETO
// =================================

function getProjectStatus(status) {

    const statuses = {

        planning:
            "📋 Planejamento",

        progress:
            "🟡 Em andamento",

        completed:
            "🟢 Concluído",

        paused:
            "⏸️ Pausado"

    };


    return (
        statuses[status] ||
        "📋 Planejamento"
    );

}

// =================================
// ANIVERSARIANTES
// =================================

function renderDashboardBirthdays() {

    if (!dashboardBirthdays) {
        return;
    }


    if (birthdays.length === 0) {

        dashboardBirthdays.innerHTML = `

            <div class="dashboard-empty">

                <div>
                    🎂
                </div>

                <p>
                    Nenhum aniversariante cadastrado.
                </p>

                <a
                    href="./pages/aniversariantes.html"
                    class="dashboard-birthday-add"
                >
                    + Adicionar aniversariante
                </a>

            </div>

        `;

        return;

    }


    // =================================
    // ORDENAR POR PROXIMIDADE
    // =================================

    const sortedBirthdays =
        [...birthdays].sort(
            function (a, b) {

                return (
                    getDaysUntilBirthday(
                        a.date
                    )
                    -
                    getDaysUntilBirthday(
                        b.date
                    )
                );

            }
        );


    // Mostrar somente os 3 próximos

    const latestBirthdays =
        sortedBirthdays.slice(
            0,
            3
        );


    dashboardBirthdays.innerHTML =
        "";


    latestBirthdays.forEach(
        function (birthday) {

            const daysUntil =
                getDaysUntilBirthday(
                    birthday.date
                );


            let status = "";


            if (daysUntil === 0) {

                status =
                    "🎉 Hoje!";

            }

            else if (daysUntil === 1) {

                status =
                    "⏳ Amanhã!";

            }

            else {

                status =
                    `⏳ Em ${daysUntil} dias`;

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "dashboard-birthday";


            // Destacar o próximo aniversário

            if (
                birthday ===
                latestBirthdays[0]
            ) {

                item.classList.add(
                    "next-birthday"
                );

            }


            item.style.cursor =
                "pointer";


            item.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "./pages/aniversariantes.html";

                }
            );


            item.innerHTML = `

                <div class="dashboard-birthday-icon">
                    🎂
                </div>


                <div class="dashboard-birthday-info">

                    <strong>
                        ${escapeHTML(
                            birthday.name
                        )}
                    </strong>


                    <span>
                        ${formatBirthdayDate(
                            birthday.date
                        )}
                    </span>

                </div>


                <div class="dashboard-birthday-status">

                    ${status}

                </div>

            `;


            dashboardBirthdays.appendChild(
                item
            );

        }
    );

}

// =================================
// DIAS ATÉ O ANIVERSÁRIO
// =================================

function getDaysUntilBirthday(date) {

    if (!date) {
        return 999999;
    }


    const birthDate =
        new Date(
            date + "T00:00:00"
        );


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let nextBirthday =
        new Date(
            today.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
        );


    if (
        nextBirthday <
        today
    ) {

        nextBirthday =
            new Date(
                today.getFullYear() + 1,
                birthDate.getMonth(),
                birthDate.getDate()
            );

    }


    const difference =
        nextBirthday.getTime() -
        today.getTime();


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

}

// =================================
// FORMATAR DATA DO ANIVERSÁRIO
// =================================

function formatBirthdayDate(date) {

    if (!date) {
        return "";
    }


    const birthDate =
        new Date(
            date + "T00:00:00"
        );


    return birthDate.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "long"
        }
    );

}

// =================================
// INICIAR DASHBOARD
// =================================

loadDashboardData();