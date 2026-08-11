console.log("NEXUS — Aniversariantes iniciado!");

// =================================
// CONFIGURAÇÃO DA API
// =================================

const API_URL = "https://nexus-api-kdu5.onrender.com/api/aniversariantes";

// =================================
// ELEMENTOS
// =================================

const newBirthdayButton =
    document.getElementById("new-birthday-button");

const emptyAddBirthday =
    document.getElementById("empty-add-birthday");

const birthdayModal =
    document.getElementById("birthday-modal");

const closeBirthdayModal =
    document.getElementById("close-birthday-modal");

const cancelBirthday =
    document.getElementById("cancel-birthday");

const birthdayForm =
    document.getElementById("birthday-form");

const birthdaysList =
    document.getElementById("birthdays-list");

const birthdayModalTitle =
    document.getElementById("birthday-modal-title");

const birthdayName =
    document.getElementById("birthday-name");

const birthdayDate =
    document.getElementById("birthday-date");

const birthdayNote =
    document.getElementById("birthday-note");


// =================================
// DADOS
// =================================

let birthdays = [];


// =================================
// ABRIR MODAL
// =================================

function openBirthdayModal() {

    birthdayModalTitle.textContent =
        "Novo aniversariante";

    birthdayForm.reset();

    birthdayForm.dataset.id = "";

    birthdayModal.classList.remove("hidden");
}


// =================================
// FECHAR MODAL
// =================================

function closeBirthdayModalFunction() {

    birthdayModal.classList.add("hidden");

    birthdayForm.reset();

    birthdayForm.dataset.id = "";
}


// =================================
// EVENTOS DOS BOTÕES
// =================================

if (newBirthdayButton) {

    newBirthdayButton.addEventListener(
        "click",
        openBirthdayModal
    );

}


if (emptyAddBirthday) {

    emptyAddBirthday.addEventListener(
        "click",
        openBirthdayModal
    );

}


if (closeBirthdayModal) {

    closeBirthdayModal.addEventListener(
        "click",
        closeBirthdayModalFunction
    );

}


if (cancelBirthday) {

    cancelBirthday.addEventListener(
        "click",
        closeBirthdayModalFunction
    );

}


// =================================
// CARREGAR ANIVERSARIANTES
// =================================

async function loadBirthdays() {

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
                "Erro ao carregar aniversariantes."
            );

        }


        birthdays =
            result.aniversariantes || [];

        console.log("Nomes recebidos da API:", birthdays);


        renderBirthdays();

        updateNextBirthday();


    } catch (error) {

        console.error(
            "Erro ao carregar aniversariantes:",
            error
        );


        birthdaysList.innerHTML = `

            <div class="birthday-empty">

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
// SALVAR ANIVERSARIANTE
// =================================

birthdayForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            birthdayForm.dataset.id;


        const name =
            birthdayName.value.trim();


        const date =
            birthdayDate.value;


        const note =
            birthdayNote.value.trim();


        if (!name || !date) {

            alert(
                "Preencha o nome e a data de nascimento."
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

                                    name:
                                        name,

                                    date:
                                        date,

                                    note:
                                        note

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

                                    name:
                                        name,

                                    date:
                                        date,

                                    note:
                                        note

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
                    "Erro ao salvar aniversariante."
                );

            }


            // =================================
            // FINALIZAR
            // =================================

            closeBirthdayModalFunction();


            await loadBirthdays();


            alert(
                id
                    ? "Aniversariante atualizado! ✏️"
                    : "Aniversariante criado! 🎂"
            );


        } catch (error) {

            console.error(
                "Erro ao salvar aniversariante:",
                error
            );


            alert(
                error.message ||
                "Não foi possível salvar o aniversariante."
            );

        }

    }
);


// =================================
// MOSTRAR ANIVERSARIANTES
// =================================

function renderBirthdays() {

    birthdaysList.innerHTML = "";


    if (birthdays.length === 0) {

        birthdaysList.innerHTML = `

            <div class="birthday-empty">

                <div>
                    🎂
                </div>

                <h3>
                    Nenhum aniversariante ainda
                </h3>

                <p>
                    Adicione o primeiro aniversariante.
                </p>

                <button
                    id="empty-add-birthday"
                    class="primary-button"
                >
                    + Adicionar aniversariante
                </button>

            </div>

        `;


        const newEmptyButton =
            document.getElementById(
                "empty-add-birthday"
            );


        newEmptyButton.addEventListener(
            "click",
            openBirthdayModal
        );


        return;

    }


    // =================================
    // ORDENAR POR PRÓXIMO ANIVERSÁRIO
    // =================================

    const sortedBirthdays =
        [...birthdays].sort(
            function (a, b) {

                return (
                    getNextBirthdayDate(a.date) -
                    getNextBirthdayDate(b.date)
                );

            }
        );


    // =================================
    // CRIAR CARDS
    // =================================

    sortedBirthdays.forEach(
        function (birthday) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "birthday-card";


            const birthdayDateFormatted =
                formatBirthdayDate(
                    birthday.date
                );


            const age =
                calculateAge(
                    birthday.date
                );


            const nextBirthday =
                getNextBirthdayDate(
                    birthday.date
                );


            const daysUntil =
                calculateDaysUntil(
                    nextBirthday
                );


            let daysText;


            if (daysUntil === 0) {

                daysText =
                    "🎉 É hoje!";

            } else if (daysUntil === 1) {

                daysText =
                    "Amanhã!";

            } else {

                daysText =
                    `Em ${daysUntil} dias`;

            }


            card.innerHTML = `

                <div class="birthday-card-icon">
                    🎂
                </div>


                <div class="birthday-card-content">

                    <h3>
                        ${escapeHTML(
                birthday.name
            )}
                    </h3>


                    <span>
                        ${birthdayDateFormatted}
                    </span>


                    <p>
                        ${age} anos
                    </p>


                    <small>
                        ${daysText}
                    </small>


                    ${birthday.note
                    ? `
                                <small>
                                    📝
                                    ${escapeHTML(
                        birthday.note
                    )}
                                </small>
                            `
                    : ""
                }


                    <div
                        class="birthday-card-actions"
                    >

                        <button
                            type="button"
                            onclick="editBirthday('${birthday.id}')"
                            title="Editar"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            onclick="deleteBirthday('${birthday.id}')"
                            title="Excluir"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;


            birthdaysList.appendChild(
                card
            );

        }
    );

}


// =================================
// PRÓXIMO ANIVERSÁRIO
// =================================

function updateNextBirthday() {

    const nameElement =
        document.getElementById(
            "next-birthday-name"
        );


    const dateElement =
        document.getElementById(
            "next-birthday-date"
        );


    if (
        !nameElement ||
        !dateElement
    ) {
        return;
    }


    if (birthdays.length === 0) {

        nameElement.textContent =
            "Nenhum aniversariante";


        dateElement.textContent =
            "Adicione alguém para começar.";


        return;

    }


    const sortedBirthdays =
        [...birthdays].sort(
            function (a, b) {

                return (
                    getNextBirthdayDate(a.date) -
                    getNextBirthdayDate(b.date)
                );

            }
        );


    const next =
        sortedBirthdays[0];


    const nextDate =
        getNextBirthdayDate(
            next.date
        );


    const daysUntil =
        calculateDaysUntil(
            nextDate
        );


    nameElement.textContent =
        next.name;


    if (daysUntil === 0) {

        dateElement.textContent =
            "🎉 É hoje!";

    } else if (daysUntil === 1) {

        dateElement.textContent =
            `Amanhã — ${formatBirthdayDate(next.date)}`;

    } else {

        dateElement.textContent =
            `${formatBirthdayDate(next.date)} — em ${daysUntil} dias`;

    }

}


// =================================
// EDITAR
// =================================

function editBirthday(id) {

    const birthday =
        birthdays.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!birthday) {
        return;
    }


    birthdayModalTitle.textContent =
        "Editar aniversariante";


    birthdayForm.dataset.id =
        birthday.id;


    birthdayName.value =
        birthday.name || "";


    birthdayDate.value =
        birthday.date || "";


    birthdayNote.value =
        birthday.note || "";


    birthdayModal.classList.remove(
        "hidden"
    );

}


// =================================
// EXCLUIR
// =================================

async function deleteBirthday(id) {

    const birthday =
        birthdays.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!birthday) {
        return;
    }


    const confirmed =
        confirm(
            `Deseja realmente excluir ${birthday.name}?`
        );


    if (!confirmed) {
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
                "Erro ao excluir aniversariante."
            );

        }


        await loadBirthdays();


        alert(
            "Aniversariante excluído! 🗑️"
        );


    } catch (error) {

        console.error(
            "Erro ao excluir:",
            error
        );


        alert(
            error.message ||
            "Não foi possível excluir o aniversariante."
        );

    }

}


// =================================
// CALCULAR IDADE
// =================================

function calculateAge(dateString) {

    const birthDate =
        new Date(
            dateString + "T00:00:00"
        );


    const today =
        new Date();


    let age =
        today.getFullYear() -
        birthDate.getFullYear();


    const month =
        today.getMonth();


    const birthMonth =
        birthDate.getMonth();


    if (
        month < birthMonth ||
        (
            month === birthMonth &&
            today.getDate() <
            birthDate.getDate()
        )
    ) {

        age--;

    }


    return age;

}


// =================================
// PRÓXIMA DATA DE ANIVERSÁRIO
// =================================

function getNextBirthdayDate(
    dateString
) {

    const birthDate =
        new Date(
            dateString + "T00:00:00"
        );


    const today =
        new Date();


    let year =
        today.getFullYear();


    let nextBirthday =
        new Date(
            year,
            birthDate.getMonth(),
            birthDate.getDate()
        );


    const todayWithoutTime =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    if (
        nextBirthday <
        todayWithoutTime
    ) {

        nextBirthday =
            new Date(
                year + 1,
                birthDate.getMonth(),
                birthDate.getDate()
            );

    }


    return nextBirthday;

}


// =================================
// DIAS ATÉ O ANIVERSÁRIO
// =================================

function calculateDaysUntil(
    date
) {

    const today =
        new Date();


    const todayWithoutTime =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    const difference =
        date -
        todayWithoutTime;


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

}


// =================================
// FORMATAR DATA
// =================================

function formatBirthdayDate(
    dateString
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
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

loadBirthdays();


// =================================
// EXPOR FUNÇÕES
// =================================

window.editBirthday =
    editBirthday;

window.deleteBirthday =
    deleteBirthday;

