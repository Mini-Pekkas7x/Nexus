console.log("NEXUS — Dashboard iniciado!");

// =============================
// ELEMENTOS
// =============================

const notesCount = document.getElementById("notes-count");
const recentNotes = document.getElementById("recent-notes");

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


// =============================
// CARREGAR DADOS
// =============================

const notes = NexusStorage.buscar("notas");

const achievements =
    NexusStorage.buscar("conquistas");

const projects =
    NexusStorage.buscar("projetos");

const birthdays =
    NexusStorage.buscar(
        "aniversariantes"
    );


// =============================
// CONTADORES
// =============================

notesCount.textContent = notes.length;

achievementsCount.textContent =
    achievements.length;

projectsCount.textContent =
    projects.length;

birthdaysCount.textContent =
    birthdays.length;

// =============================
// STATUS DOS PROJETOS
// =============================

const inProgress =
    projects.filter(function (project) {

        return project.status === "progress";

    }).length;


const completed =
    projects.filter(function (project) {

        return project.status === "completed";

    }).length;


projectsInProgress.textContent =
    inProgress;

projectsCompleted.textContent =
    completed;


// =============================
// SEGURANÇA
// =============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;

}


// =============================
// NOTAS RECENTES
// =============================

function renderRecentNotes() {

    recentNotes.innerHTML = "";


    if (notes.length === 0) {

        recentNotes.innerHTML = `

            <div class="dashboard-empty">

                <div>📝</div>

                <p>
                    Nenhuma nota ainda.
                </p>

            </div>

        `;

        return;
    }


    const sortedNotes =
        [...notes].sort(function (a, b) {

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

        });


    const latestNotes =
        sortedNotes.slice(0, 3);


    latestNotes.forEach(function (note) {

        const item =
            document.createElement("div");

        item.className =
            "dashboard-note";


        item.innerHTML = `

            <div class="dashboard-note-icon">
                📝
            </div>

            <div class="dashboard-note-info">

                <strong>
                    ${escapeHTML(note.title)}
                </strong>

                <span>
                    ${escapeHTML(note.category)}
                </span>

            </div>

        `;


        recentNotes.appendChild(item);

    });
}


// =============================
// CONQUISTAS RECENTES
// =============================

function renderRecentAchievements() {

    recentAchievements.innerHTML = "";


    if (achievements.length === 0) {

        recentAchievements.innerHTML = `

            <div class="dashboard-empty">

                <div>🏆</div>

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


    const latestAchievements =
        sortedAchievements.slice(0, 3);


    latestAchievements.forEach(
        function (achievement) {

            const item =
                document.createElement("div");


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


// =============================
// PROJETOS RECENTES
// =============================

function renderRecentProjects() {

    recentProjects.innerHTML = "";


    if (projects.length === 0) {

        recentProjects.innerHTML = `

            <div class="dashboard-empty">

                <div>🚀</div>

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


    const latestProjects =
        sortedProjects.slice(0, 3);


    latestProjects.forEach(
        function (project) {

            const item =
                document.createElement("div");


            item.className =
                "dashboard-project";


            const statusInfo =
                getProjectStatus(
                    project.status
                );


            const progress =
                Number(project.progress) || 0;


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


            recentProjects.appendChild(item);

        }
    );
}


// =============================
// STATUS
// =============================

function getProjectStatus(status) {

    const statuses = {

        planning: "📋 Planejamento",

        progress: "🟡 Em andamento",

        completed: "🟢 Concluído",

        paused: "⏸️ Pausado"

    };


    return (
        statuses[status] ||
        "📋 Planejamento"
    );
}


// =============================
// INICIAR
// =============================

renderRecentNotes();

renderRecentAchievements();

renderRecentProjects();

// =============================
// ANIVERSARIANTES NO DASHBOARD
// =============================

function renderDashboardBirthdays() {

    const birthdays =
        NexusStorage.buscar(
            "aniversariantes"
        );


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


    // =============================
    // ORDENAR POR PROXIMIDADE
    // =============================

    const sortedBirthdays =
        [...birthdays].sort(
            function (a, b) {

                return (
                    getDaysUntilBirthday(a.date) -
                    getDaysUntilBirthday(b.date)
                );

            }
        );


    // Mostrar somente os 3 próximos

    const latestBirthdays =
        sortedBirthdays.slice(0, 3);


    dashboardBirthdays.innerHTML = "";


    latestBirthdays.forEach(
        function (birthday) {

            const daysUntil =
                getDaysUntilBirthday(
                    birthday.date
                );


            let status = "";


            if (daysUntil === 0) {

                status = "🎉 Hoje!";

            }

            else if (daysUntil === 1) {

                status = "⏳ Amanhã!";

            }

            else {

                status =
                    `⏳ Em ${daysUntil} dias`;

            }


            const item =
                document.createElement("div");


            item.className =
    "dashboard-birthday";


// Destacar o próximo aniversário

if (
    birthday === latestBirthdays[0]
) {

    item.classList.add(
        "next-birthday"
    );

}

                item.style.cursor = "pointer";

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


// =============================
// DIAS ATÉ O ANIVERSÁRIO
// =============================

function getDaysUntilBirthday(date) {

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


    if (nextBirthday < today) {

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


// =============================
// FORMATAR DATA
// =============================

function formatBirthdayDate(date) {

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


// =============================
// SEGURANÇA
// =============================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text || "";


    return div.innerHTML;

}


// =============================
// INICIAR ANIVERSARIANTES
// =============================

renderDashboardBirthdays();