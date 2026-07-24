/* =========================================
   NAVEGACIÓN ENTRE SECCIONES
========================================= */

const menuLinks = document.querySelectorAll(".nav-link");

const sections = document.querySelectorAll(".page-section");


menuLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();


        const sectionName = this.dataset.section;


        const selectedSection =
            document.getElementById(sectionName);


        if (!selectedSection) return;


        sections.forEach(section => {

            section.classList.remove("active");

        });


        document
            .querySelectorAll(".nav-menu .nav-link")
            .forEach(menuLink => {

                menuLink.classList.remove("active");

            });


        selectedSection.classList.add("active");


        const activeMenuLink =
            document.querySelector(
                `.nav-menu .nav-link[data-section="${sectionName}"]`
            );


        if (activeMenuLink) {

            activeMenuLink.classList.add("active");

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

});


/* =========================================
   ELEMENTOS DEL SISTEMA DE RESERVAS
========================================= */

const bookingDate =
    document.getElementById("booking-date");


const bookingBarber =
    document.getElementById("booking-barber");


const bookingService =
    document.getElementById("booking-service");


const scheduleGrid =
    document.getElementById("schedule-grid");


const bookingForm =
    document.getElementById("booking-form");


const barberEmail =
    document.getElementById("barber-email");


const customServiceContainer =
    document.getElementById(
        "custom-service-container"
    );


const customService =
    document.getElementById(
        "custom-service"
    );


/* =========================================
   ELEMENTOS DEL MODAL
========================================= */

const reservationModal =
    document.getElementById(
        "reservation-modal"
    );


const closeReservationModal =
    document.getElementById(
        "close-reservation-modal"
    );


const reservationConfirmButton =
    document.getElementById(
        "reservation-confirm-button"
    );


let selectedTime = null;


/* =========================================
   CORREOS DE LOS BARBEROS
========================================= */

const barberEmails = {

    "Todos":
        "classicblade@gmail.com",

    "Barbero 01":
        "samuel.vegagarc@ieprogresar.edu.co",

    "Barbero 02":
        "sebastian.villhern@ieprogresar.edu.co",

    "Barbero 03":
        "andriu.granmait@ieprogresar.edu.co",

    "Barbero 04":
        "jose.millorti@ieprogresar.edu.co"

};


/* =========================================
   MOSTRAR CORREO DEL BARBERO
========================================= */

function updateBarberEmail() {


    if (!barberEmail) return;


    const selectedBarber =
        bookingBarber.value;


    const email =
        barberEmails[selectedBarber];


    if (selectedBarber === "Todos") {


        barberEmail.innerHTML = `

            <i class="fa-regular fa-envelope"></i>

            <span>

                Correo del negocio:
                ${email}

            </span>

        `;

    }


    else {


        barberEmail.innerHTML = `

            <i class="fa-regular fa-envelope"></i>

            <span>

                Correo del barbero:
                ${email}

            </span>

        `;

    }

}


/* =========================================
   FECHA MÍNIMA
========================================= */

const today =

    new Date()
        .toISOString()
        .split("T")[0];


bookingDate.min = today;


/* =========================================
   HORARIOS DISPONIBLES
========================================= */

const availableHours = [

    "09:00",

    "10:00",

    "11:00",

    "12:00",

    "13:00",

    "14:00",

    "15:00",

    "16:00",

    "17:00",

    "18:00",

    "19:00"

];


/* =========================================
   MOSTRAR HORARIOS
========================================= */

function renderSchedule() {


    scheduleGrid.innerHTML = "";


    selectedTime = null;


    const selectedDate =
        bookingDate.value;


    const selectedBarber =
        bookingBarber.value;


    if (!selectedDate) {


        scheduleGrid.innerHTML = `

            <div class="empty-schedule">

                <i class="fa-regular fa-calendar"></i>

                <p>

                    Selecciona una fecha para ver
                    los horarios disponibles.

                </p>

            </div>

        `;


        return;

    }


    const reservations =

        JSON.parse(

            localStorage.getItem(
                "classicBladeReservations"
            )

        ) || [];


    availableHours.forEach(hour => {


        const isReserved =

            reservations.some(reservation => {


                return (

                    reservation.date === selectedDate &&

                    reservation.time === hour &&

                    (

                        reservation.barber === selectedBarber ||

                        selectedBarber === "Todos" ||

                        reservation.barber === "Todos"

                    )

                );

            });


        const timeButton =
            document.createElement("button");


        timeButton.type = "button";


        timeButton.classList.add(
            "time-slot"
        );


        timeButton.innerHTML = `

            <strong>

                ${hour}

            </strong>

            <span>

                ${
                    isReserved
                        ? "RESERVADO"
                        : "DISPONIBLE"
                }

            </span>

        `;


        if (isReserved) {


            timeButton.classList.add(
                "reserved"
            );


            timeButton.disabled = true;


        }


        else {


            timeButton.classList.add(
                "available"
            );


            timeButton.addEventListener(

                "click",

                function() {


                    document
                        .querySelectorAll(
                            ".time-slot"
                        )
                        .forEach(slot => {


                            slot.classList.remove(
                                "selected"
                            );

                        });


                    this.classList.add(
                        "selected"
                    );


                    selectedTime = hour;


                }

            );

        }


        scheduleGrid.appendChild(
            timeButton
        );

    });

}


/* =========================================
   CAMBIAR FECHA
========================================= */

bookingDate.addEventListener(

    "change",

    renderSchedule

);


/* =========================================
   CAMBIAR BARBERO
========================================= */

bookingBarber.addEventListener(

    "change",

    function() {


        updateBarberEmail();


        renderSchedule();


    }

);


/* =========================================
   SERVICIO PERSONALIZADO
========================================= */

bookingService.addEventListener(

    "change",

    function() {


        if (

            bookingService.value ===
            "Personalizado"

        ) {


            customServiceContainer.classList.add(
                "active"
            );


            customService.required = true;


        }


        else {


            customServiceContainer.classList.remove(
                "active"
            );


            customService.required = false;


            customService.value = "";

        }

    }

);


/* =========================================
   CONFIRMAR RESERVA
========================================= */

bookingForm.addEventListener(

    "submit",

    function(event) {


        event.preventDefault();


        if (!selectedTime) {


            alert(

                "Primero debes seleccionar un horario disponible."

            );


            return;

        }


        if (!bookingService.value) {


            alert(

                "Primero debes seleccionar un servicio."

            );


            return;

        }


        const clientName =

            document.getElementById(
                "client-name"
            ).value.trim();


        const clientPhone =

            document.getElementById(
                "client-phone"
            ).value.trim();


        const selectedDate =
            bookingDate.value;


        const selectedBarber =
            bookingBarber.value;


        let selectedService =
            bookingService.value;


        if (

            selectedService ===
            "Personalizado"

        ) {


            selectedService =
                customService.value.trim();


        }


        const reservations =

            JSON.parse(

                localStorage.getItem(
                    "classicBladeReservations"
                )

            ) || [];


        const alreadyReserved =

            reservations.some(reservation => {


                return (

                    reservation.date === selectedDate &&

                    reservation.time === selectedTime &&

                    (

                        reservation.barber === selectedBarber ||

                        selectedBarber === "Todos" ||

                        reservation.barber === "Todos"

                    )

                );

            });


        if (alreadyReserved) {


            alert(

                "Ese horario acaba de ser reservado. Selecciona otro."

            );


            renderSchedule();


            return;

        }


        const newReservation = {


            name:
                clientName,


            phone:
                clientPhone,


            date:
                selectedDate,


            barber:
                selectedBarber,


            time:
                selectedTime,


            service:
                selectedService

        };


        reservations.push(
            newReservation
        );


        localStorage.setItem(

            "classicBladeReservations",

            JSON.stringify(
                reservations
            )

        );


        document.getElementById(
            "modal-client-name"
        ).textContent =
            clientName;


        document.getElementById(
            "modal-client-phone"
        ).textContent =
            clientPhone;


        document.getElementById(
            "modal-service"
        ).textContent =
            selectedService;


        document.getElementById(
            "modal-barber"
        ).textContent =
            selectedBarber;


        document.getElementById(
            "modal-date"
        ).textContent =
            selectedDate;


        document.getElementById(
            "modal-time"
        ).textContent =
            selectedTime;


        reservationModal.classList.add(
            "active"
        );


        document.body.classList.add(
            "modal-open"
        );


        bookingForm.reset();


        selectedTime = null;


        customServiceContainer.classList.remove(
            "active"
        );


        customService.required = false;


        updateBarberEmail();


        renderSchedule();

    }

);


/* =========================================
   CERRAR MODAL DE RESERVA
========================================= */

function closeReservation() {


    reservationModal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


closeReservationModal.addEventListener(

    "click",

    closeReservation

);


reservationConfirmButton.addEventListener(

    "click",

    closeReservation

);


reservationModal.addEventListener(

    "click",

    function(event) {


        if (

            event.target ===
            reservationModal

        ) {


            closeReservation();

        }

    }

);


/* =========================================
   CERRAR MODAL CON ESCAPE
========================================= */

document.addEventListener(

    "keydown",

    function(event) {


        if (

            event.key === "Escape" &&

            reservationModal.classList.contains(
                "active"
            )

        ) {


            closeReservation();

        }

    }

);


/* =========================================
   PREVISUALIZACIÓN DE GALERÍA
========================================= */

const galleryImages =
    document.querySelectorAll(
        ".gallery-image"
    );


const imageModal =
    document.getElementById(
        "image-modal"
    );


const modalImage =
    document.getElementById(
        "modal-image"
    );


const modalCaption =
    document.getElementById(
        "modal-caption"
    );


const closeModal =
    document.getElementById(
        "close-modal"
    );


galleryImages.forEach(image => {


    image.addEventListener(

        "click",

        function() {


            modalImage.src =
                this.src;


            modalImage.alt =
                this.alt;


            modalCaption.textContent =
                this.alt;


            imageModal.classList.add(
                "active"
            );


            document.body.classList.add(
                "modal-open"
            );

        }

    );

});


/* =========================================
   CERRAR MODAL DE GALERÍA
========================================= */

function closeImageModal() {


    imageModal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );


    modalImage.src = "";

}


closeModal.addEventListener(

    "click",

    closeImageModal

);


imageModal.addEventListener(

    "click",

    function(event) {


        if (

            event.target ===
            imageModal

        ) {


            closeImageModal();

        }

    }

);


document.addEventListener(

    "keydown",

    function(event) {


        if (

            event.key === "Escape" &&

            imageModal.classList.contains(
                "active"
            )

        ) {


            closeImageModal();

        }

    }

);


/* =========================================
   CARGA INICIAL
========================================= */

updateBarberEmail();


renderSchedule();