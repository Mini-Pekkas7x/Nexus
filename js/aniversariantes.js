console.log("NEXUS — Aniversariantes iniciado!");


// =============================
// ELEMENTOS
// =============================

const birthdayModal =
    document.getElementById("birthday-modal");

const newBirthdayButton =
    document.getElementById("new-birthday-button");

const emptyAddBirthday =
    document.getElementById("empty-add-birthday");

const closeBirthdayModal =
    document.getElementById("close-birthday-modal");

const cancelBirthday =
    document.getElementById("cancel-birthday");

const birthdayOverlay =
    document.querySelector(".modal-overlay");

const birthdayForm =
    document.getElementById("birthday-form");

const birthdayName =
    document.getElementById("birthday-name");

const birthdayDate =
    document.getElementById("birthday-date");

const birthdayNote =
    document.getElementById("birthday-note");

const birthdaysList =
    document.getElementById("birthdays-list");


// =============================
// ID EM EDIÇÃO
// =============================

let editingBirthdayId = null;


// =============================
// ABRIR MODAL
// =============================

function openBirthdayModal() {

    birthdayForm.reset();

    editingBirthdayId = null;

    document.getElementById(
        "birthday-modal-title"
    ).textContent = "Novo aniversariante";

    birthdayModal.classList.remove("hidden");

    birthdayName.focus();

}


// =============================
// FECHAR MODAL
// =============================

function closeBirthdayModalFunction() {

    birthdayModal.classList.add("hidden");

    birthdayForm.reset();

    editingBirthdayId = null;

    document.getElementById(
        "birthday-modal-title"
    ).textContent = "Novo aniversariante";

}


// =============================
// EVENTOS
// =============================

newBirthdayButton.addEventListener(
    "click",
    openBirthdayModal
);


if (emptyAddBirthday) {

    emptyAddBirthday.addEventListener(
        "click",
        openBirthdayModal
    );

}


closeBirthdayModal.addEventListener(
    "click",
    closeBirthdayModalFunction
);


cancelBirthday.addEventListener(
    "click",
    closeBirthdayModalFunction
);


birthdayOverlay.addEventListener(
    "click",
    closeBirthdayModalFunction
);


// =============================
// SALVAR
// =============================

birthdayForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            birthdayName.value.trim();


        const date =
            birthdayDate.value;


        const note =
            birthdayNote.value.trim();


        if (!name || !date) {

            return;

        }


        const birthdays =
            NexusStorage.buscar(
                "aniversariantes"
            );


        // =============================
        // EDITAR
        // =============================

        if (editingBirthdayId !== null) {

            const index =
                birthdays.findIndex(
                    function (birthday) {

                        return (
                            birthday.id ===
                            editingBirthdayId
                        );

                    }
                );


            if (index !== -1) {

                birthdays[index].name =
                    name;

                birthdays[index].date =
                    date;

                birthdays[index].note =
                    note;

                birthdays[index].updatedAt =
                    new Date().toISOString();

            }

        }


        // =============================
        // NOVO
        // =============================

        else {

            const birthday = {

                id: Date.now(),

                name: name,

                date: date,

                note: note,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };


            birthdays.push(
                birthday
            );

        }


        NexusStorage.salvar(
            "aniversariantes",
            birthdays
        );


        renderBirthdays();

        updateNextBirthday();

        closeBirthdayModalFunction();

    }
);


// =============================
// RENDERIZAR
// =============================

function renderBirthdays() {

    const birthdays =
        NexusStorage.buscar(
            "aniversariantes"
        );


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


        document
            .getElementById(
                "empty-add-birthday"
            )
            .addEventListener(
                "click",
                openBirthdayModal
            );


        return;

    }


    birthdaysList.innerHTML = "";


    // =============================
    // ORDENAR POR PROXIMIDADE
    // =============================

    const sortedBirthdays =
        [...birthdays].sort(
            function (a, b) {

                const daysA =
                    getDaysUntilBirthday(
                        a.date
                    );


                const daysB =
                    getDaysUntilBirthday(
                        b.date
                    );


                return daysA - daysB;

            }
        );


    // =============================
    // CRIAR CARDS
    // =============================

    sortedBirthdays.forEach(
        function (birthday) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "birthday-card";


            const age =
                calculateAge(
                    birthday.date
                );


            const formattedDate =
                formatBirthdayDate(
                    birthday.date
                );


            const daysUntil =
                getDaysUntilBirthday(
                    birthday.date
                );


            // =============================
            // STATUS DO ANIVERSÁRIO
            // =============================

            let birthdayStatus = "";


            if (daysUntil === 0) {

                birthdayStatus = `

                    <div class="birthday-countdown today">

                        🎉 Hoje é o aniversário!

                    </div>

                `;

            }

            else if (daysUntil === 1) {

                birthdayStatus = `

                    <div class="birthday-countdown tomorrow">

                        ⏳ Amanhã!

                    </div>

                `;

            }

            else {

                birthdayStatus = `

                    <div class="birthday-countdown">

                        ⏳ Em ${daysUntil} dias

                    </div>

                `;

            }


            // =============================
            // HTML DO CARD
            // =============================

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


                    <p>

                        🎂 ${formattedDate}

                    </p>


                    <span>

                        ${age} anos

                    </span>


                    ${birthdayStatus}


                    ${
                        birthday.note
                            ? `

                                <small>

                                    ${escapeHTML(
                                        birthday.note
                                    )}

                                </small>

                            `
                            : ""
                    }


                    <div class="birthday-card-actions">


                        <button
                            class="edit-birthday"
                            data-id="${birthday.id}"
                            title="Editar"
                        >

                            ✏️

                        </button>


                        <button
                            class="delete-birthday"
                            data-id="${birthday.id}"
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


    addBirthdayActionEvents();

}


// =============================
// EVENTOS DOS CARDS
// =============================

function addBirthdayActionEvents() {

    const editButtons =
        document.querySelectorAll(
            ".edit-birthday"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-birthday"
        );


    editButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    editBirthday(
                        Number(
                            button.dataset.id
                        )
                    );

                }
            );

        }
    );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    deleteBirthday(
                        Number(
                            button.dataset.id
                        )
                    );

                }
            );

        }
    );

}


// =============================
// EDITAR
// =============================

function editBirthday(id) {

    const birthdays =
        NexusStorage.buscar(
            "aniversariantes"
        );


    const birthday =
        birthdays.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!birthday) {

        return;

    }


    editingBirthdayId =
        birthday.id;


    birthdayName.value =
        birthday.name;


    birthdayDate.value =
        birthday.date;


    birthdayNote.value =
        birthday.note || "";


    document.getElementById(
        "birthday-modal-title"
    ).textContent =
        "Editar aniversariante";


    birthdayModal.classList.remove(
        "hidden"
    );


    birthdayName.focus();

}


// =============================
// EXCLUIR
// =============================

function deleteBirthday(id) {

    const birthdays =
        NexusStorage.buscar(
            "aniversariantes"
        );


    const birthday =
        birthdays.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!birthday) {

        return;

    }


    const confirmDelete =
        confirm(
            `Excluir o aniversariante "${birthday.name}"?`
        );


    if (!confirmDelete) {

        return;

    }


    const updatedBirthdays =
        birthdays.filter(
            function (item) {

                return item.id !== id;

            }
        );


    NexusStorage.salvar(
        "aniversariantes",
        updatedBirthdays
    );


    renderBirthdays();

    updateNextBirthday();

}


// =============================
// CALCULAR IDADE
// =============================

function calculateAge(date) {

    const birthDate =
        new Date(
            date + "T00:00:00"
        );


    const today =
        new Date();


    let age =
        today.getFullYear() -
        birthDate.getFullYear();


    if (
        today.getMonth() <
        birthDate.getMonth() ||
        (
            today.getMonth() ===
            birthDate.getMonth() &&
            today.getDate() <
            birthDate.getDate()
        )
    ) {

        age--;

    }


    return age;

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


    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    return days;

}


// =============================
// SEGURANÇA
// =============================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


// =============================
// PRÓXIMO ANIVERSÁRIO
// =============================

function updateNextBirthday() {

    const birthdays =
        NexusStorage.buscar(
            "aniversariantes"
        );


    const nextName =
        document.getElementById(
            "next-birthday-name"
        );


    const nextDate =
        document.getElementById(
            "next-birthday-date"
        );


    if (birthdays.length === 0) {

        nextName.textContent =
            "Nenhum aniversariante";


        nextDate.textContent =
            "Adicione alguém para começar.";


        return;

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let closestBirthday =
        null;


    let closestDays =
        Infinity;


    birthdays.forEach(
        function (birthday) {

            const days =
                getDaysUntilBirthday(
                    birthday.date
                );


            if (days < closestDays) {

                closestDays =
                    days;

                closestBirthday =
                    birthday;

            }

        }
    );


    nextName.textContent =
        closestBirthday.name;


    if (closestDays === 0) {

        nextDate.textContent =
            "🎉 Hoje é o aniversário!";

    }

    else if (closestDays === 1) {

        nextDate.textContent =
            "🎂 Amanhã!";

    }

    else {

        nextDate.textContent =
            `${formatBirthdayDate(
                closestBirthday.date
            )} • Em ${closestDays} dias`;

    }

}


// =============================
// INICIAR
// =============================

renderBirthdays();

updateNextBirthday();