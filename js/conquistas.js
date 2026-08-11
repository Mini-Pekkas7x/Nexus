console.log("NEXUS — Conquistas iniciado!");

// =================================
// CONFIGURAÇÃO DA API
// =================================

const API_URL =
    "http://localhost:3000/api/conquistas";


// =================================
// ELEMENTOS
// =================================

const newAchievementButton =
    document.getElementById(
        "new-achievement-button"
    );

const modal =
    document.getElementById(
        "achievement-modal"
    );

const closeModal =
    document.getElementById(
        "close-achievement-modal"
    );

const cancelAchievement =
    document.getElementById(
        "cancel-achievement"
    );

const achievementForm =
    document.getElementById(
        "achievement-form"
    );

const achievementsContainer =
    document.getElementById(
        "achievements-container"
    );

const searchAchievements =
    document.getElementById(
        "search-achievements"
    );

const filterCategory =
    document.getElementById(
        "filter-achievement-category"
    );


// =================================
// DADOS
// =================================

let achievements = [];


// =================================
// ABRIR MODAL — NOVA CONQUISTA
// =================================

function openAchievementModal() {

    document.getElementById(
        "achievement-modal-title"
    ).textContent =
        "Nova conquista";


    achievementForm.reset();


    document.getElementById(
        "achievement-id"
    ).value = "";


    // Coloca a data de hoje

    document.getElementById(
        "achievement-date"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];


    modal.classList.remove(
        "hidden"
    );

}


// =================================
// FECHAR MODAL
// =================================

function closeAchievementModal() {

    modal.classList.add(
        "hidden"
    );

    achievementForm.reset();

    document.getElementById(
        "achievement-id"
    ).value = "";

}


// =================================
// EVENTOS DOS BOTÕES
// =================================

if (newAchievementButton) {

    newAchievementButton.addEventListener(
        "click",
        openAchievementModal
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeAchievementModal
    );

}


if (cancelAchievement) {

    cancelAchievement.addEventListener(
        "click",
        closeAchievementModal
    );

}


// =================================
// CARREGAR CONQUISTAS
// =================================

async function loadAchievements() {

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
                "Erro ao carregar conquistas."
            );

        }


        achievements =
            result.conquistas || [];


        renderAchievements();


    } catch (error) {

        console.error(
            "Erro ao carregar conquistas:",
            error
        );


        achievementsContainer.innerHTML = `

            <div class="achievement-empty">

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
// SALVAR CONQUISTA
// =================================

achievementForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "achievement-id"
            ).value;


        const title =
            document.getElementById(
                "achievement-title"
            ).value.trim();


        const category =
            document.getElementById(
                "achievement-category"
            ).value;


        const date =
            document.getElementById(
                "achievement-date"
            ).value;


        const description =
            document.getElementById(
                "achievement-description"
            ).value.trim();


        // =================================
        // VALIDAR
        // =================================

        if (
            !title ||
            !date ||
            !description
        ) {

            alert(
                "Preencha todos os campos."
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

                                    category:
                                        category,

                                    date:
                                        date,

                                    description:
                                        description

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

                                    category:
                                        category,

                                    date:
                                        date,

                                    description:
                                        description

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
                    "Erro ao salvar conquista."
                );

            }


            // =================================
            // FINALIZAR
            // =================================

            closeAchievementModal();


            await loadAchievements();


            alert(
                id
                    ? "Conquista atualizada! ✏️"
                    : "Conquista criada! 🏆"
            );


        } catch (error) {

            console.error(
                "Erro ao salvar conquista:",
                error
            );


            alert(
                error.message ||
                "Não foi possível salvar a conquista."
            );

        }

    }
);


// =================================
// RENDERIZAR CONQUISTAS
// =================================

function renderAchievements() {

    const search =
        searchAchievements
            ? searchAchievements.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        filterCategory
            ? filterCategory.value
            : "all";


    let filteredAchievements =
        achievements.filter(
            function (achievement) {

                const title =
                    achievement.title ||
                    "";


                const description =
                    achievement.description ||
                    "";


                const matchesSearch =
                    title
                        .toLowerCase()
                        .includes(search)
                    ||
                    description
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all"
                    ||
                    achievement.category ===
                        category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    // =================================
    // MAIS RECENTES PRIMEIRO
    // =================================

    filteredAchievements.sort(
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


    achievementsContainer.innerHTML =
        "";


    // =================================
    // NENHUMA CONQUISTA
    // =================================

    if (
        filteredAchievements.length === 0
    ) {

        achievementsContainer.innerHTML = `

            <div class="achievement-empty">

                <div>
                    🏆
                </div>

                <h3>
                    Nenhuma conquista encontrada
                </h3>

                <p>
                    Crie uma conquista ou tente outra pesquisa.
                </p>

            </div>

        `;

        return;

    }


    // =================================
    // CRIAR CARDS
    // =================================

    filteredAchievements.forEach(
        function (achievement) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "achievement-card";


            card.innerHTML = `

                <div class="achievement-icon">
                    🏆
                </div>


                <h3>
                    ${escapeHTML(
                        achievement.title
                    )}
                </h3>


                <span class="achievement-category">
                    ${escapeHTML(
                        achievement.category ||
                        ""
                    )}
                </span>


                <p class="achievement-description">
                    ${escapeHTML(
                        achievement.description ||
                        ""
                    )}
                </p>


                <div class="achievement-footer">

                    <span>
                        📅
                        ${formatDate(
                            achievement.date
                        )}
                    </span>


                    <div class="achievement-actions">

                        <button
                            type="button"
                            onclick="editAchievement('${achievement.id}')"
                            title="Editar"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            onclick="deleteAchievement('${achievement.id}')"
                            title="Excluir"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;


            achievementsContainer.appendChild(
                card
            );

        }
    );

}


// =================================
// EDITAR CONQUISTA
// =================================

function editAchievement(id) {

    const achievement =
        achievements.find(
            function (achievement) {

                return String(
                    achievement.id
                ) === String(id);

            }
        );


    if (!achievement) {

        return;

    }


    document.getElementById(
        "achievement-modal-title"
    ).textContent =
        "Editar conquista";


    document.getElementById(
        "achievement-id"
    ).value =
        achievement.id;


    document.getElementById(
        "achievement-title"
    ).value =
        achievement.title || "";


    document.getElementById(
        "achievement-category"
    ).value =
        achievement.category || "Outros";


    document.getElementById(
        "achievement-date"
    ).value =
        achievement.date || "";


    document.getElementById(
        "achievement-description"
    ).value =
        achievement.description || "";


    modal.classList.remove(
        "hidden"
    );

}


// =================================
// EXCLUIR CONQUISTA
// =================================

async function deleteAchievement(id) {

    const achievement =
        achievements.find(
            function (achievement) {

                return String(
                    achievement.id
                ) === String(id);

            }
        );


    if (!achievement) {

        return;

    }


    const confirmDelete =
        confirm(
            `Deseja realmente excluir "${achievement.title}"?`
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
                "Erro ao excluir conquista."
            );

        }


        await loadAchievements();


        alert(
            "Conquista excluída! 🗑️"
        );


    } catch (error) {

        console.error(
            "Erro ao excluir conquista:",
            error
        );


        alert(
            error.message ||
            "Não foi possível excluir a conquista."
        );

    }

}


// =================================
// PESQUISA
// =================================

if (searchAchievements) {

    searchAchievements.addEventListener(
        "input",
        renderAchievements
    );

}


// =================================
// FILTRO
// =================================

if (filterCategory) {

    filterCategory.addEventListener(
        "change",
        renderAchievements
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
        date + "T00:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );

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

loadAchievements();


// =================================
// ABRIR MODAL PELO DASHBOARD
// =================================

const params =
    new URLSearchParams(
        window.location.search
    );


if (
    params.get("novo") === "true"
) {

    if (newAchievementButton) {

        newAchievementButton.click();

    }

}


// =================================
// EXPOR FUNÇÕES
// =================================

window.editAchievement =
    editAchievement;

window.deleteAchievement =
    deleteAchievement;