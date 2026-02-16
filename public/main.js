$(function () {
    const $carousel = $('.invest__carousel').flickity({
        cellAlign: 'center',
        contain: true,
        prevNextButtons: false,
        pageDots: true,
        wrapAround: true,
        imagesLoaded: true,
        draggable: true,
        autoPlay: 3000,
        pauseAutoPlayOnHover: true,
        selectedAttraction: 0.01, // Чем меньше, тем медленнее притягивается (плавнее)
        friction: 0.15
        // ----------------------------
    });

    const flkty = $carousel.data('flickity');

    $carousel.on('select.flickity settle.flickity', function () {
        flkty.reposition();
    });

    function setActivePlan(planKey) {
        $('.plan').removeClass('is-active');
        $(`.plan[data-plan="${planKey}"]`).addClass('is-active');
    }

    function updateFromSelected() {
        const selectedEl = flkty.selectedElement;
        if (!selectedEl) return;

        const planKey = selectedEl.getAttribute('data-plan');
        if (!planKey) return;

        setActivePlan(planKey);
    }

    updateFromSelected();

    $carousel.on('select.flickity', function () {
        updateFromSelected();
    });

});

const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');

function checkFormValidity() {
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const phoneRegex = /^\+?\d{10,15}$/;
    const isAgree = form.querySelector('[name="agree"]').checked;

    const isValid = name.length > 0 && phoneRegex.test(phone) && isAgree;

    submitBtn.disabled = !isValid;

    if (isValid) {
        submitBtn.classList.remove('disabled');
    } else {
        submitBtn.classList.add('disabled');
    }
}

form.addEventListener('input', checkFormValidity);
form.querySelector('[name="agree"]').addEventListener('change', checkFormValidity);


form.querySelectorAll('.lead__input').forEach(input => {
    input.addEventListener('blur', function () {
        validateField(this);
    });

    input.addEventListener('input', function () {
        if (this.classList.contains('error')) {
            validateField(this);
        }
    });
});

function validateField(input) {
    const errorId = input.name + 'Error';
    let isValid = true;

    if (input.name === 'name') {
        isValid = input.value.trim().length > 0;
    } else if (input.name === 'phone') {
        const phoneRegex = /^\+?\d{10,15}$/;
        isValid = phoneRegex.test(input.value.trim());
    } else if (input.name === 'email') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        isValid = input.value.trim() === "" || emailRegex.test(input.value.trim());
    }

    if (!isValid) {
        showError(input, errorId);
    } else {
        hideError(input, errorId);
    }
}

function showError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    input.classList.add('error');
    if (errorElement) {
        errorElement.style.display = 'block';
    }
}

function hideError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    input.classList.remove('error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        if (key === 'agree') {
            data[key] = true;
        } else {
            data[key] = value.trim();
        }
    });

    console.log('Данные формы в формате JSON:');
    console.log(JSON.stringify(data, null, 2));

});
let projectSwiper = null;
const projectDescriptions = {
    project1: `
        Ми створюємо мережу народних закладів харчування з унікальною моделлю: <span>смачна та здорова їжа за собівартістю.</span><br><br>
        У закладах запроваджується <span>система абонементів</span> (1, 3, 6 місяців або рік), що надає доступ до їжі та напоїв за собівартістю. <b>Військові, ветерани, пенсіонери, внутрішньо переміщені особи, люди з інвалідністю, сімʼї полеглих Героїв та інвестори</b> можуть харчуватися за собівартістю без придбання абонементу.<br><br>
        Для інших відвідувачів ціни залишаються нижчими за ринкові, з помірною націнкою, яка забезпечує стабільну операційну модель і прибутковість бізнесу.<br><br>
        Інвестиція від 2 000 грн може окупитися менш ніж за місяць лише за рахунок власного харчування.
    `,
    project2: `
        <b>Оборонний кластер</b> — це єдина виробничо-сервісна екосистема підприємств під одним брендом для посилення обороноздатності України та підтримки ЗСУ.<br><br>
        Мета кластера — об'єднати критично важливі напрями для оптимізації витрат, пришвидшення виконання замовлень і забезпечення стабільного постачання продукції та послуг оборонному сектору.<br><br>
        <b>Основні напрями діяльності:</b><br>
        • ремонт і модернізація транспорту та спеціалізованої техніки;<br>
        • бронювання, фарбування в мілітарі-кольори;<br>
        • переобладнання техніки для підвищення безпеки й комфорту екіпажів;<br>
        • виробництво біонічних протезів;<br>
        • пошиття спеціалізованого екіпірування;<br>
        • розробка та виробництво дронів та літальних апаратів;<br>
        • роботизовані рішення для оборонної сфери;<br>
        • власний дата-центр і розвиток ШІ для обробки даних та аналітики.
    `
};

document.querySelectorAll('.project__one-btn').forEach((btn, index) => {
    const projectCard = btn.closest('.project__one');
    const textBox = projectCard.querySelector('.project__small');

    textBox.setAttribute('data-short-text', textBox.innerHTML);
    btn.swiperInstance = null;

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const projectId = this.getAttribute('data-project') || `project${index + 1}`;
        const shortText = textBox.getAttribute('data-short-text');
        const secondBlock = projectCard.querySelector('.project__second-block');
        const call_manager = projectCard.querySelector('#call_manager');
        const second_item = projectCard.querySelector('.project__second-item');

        const staticImg = projectCard.querySelector('.project-static-img');
        const sliderContainer = projectCard.querySelector('.project-slider');

        projectCard.classList.toggle('is-expanded');
        if (secondBlock) secondBlock.classList.toggle('column');
        if (call_manager) call_manager.classList.toggle('hidden');

        if (projectCard.classList.contains('is-expanded')) {
            textBox.innerHTML = projectDescriptions[projectId] || projectDescriptions.project1;
            this.textContent = 'Згорнути';
            if (second_item) second_item.style.gap = '46px';

            if (staticImg) staticImg.classList.add('hidden');
            if (sliderContainer) {
                sliderContainer.style.display = 'block';

                // Инициализация Swiper для конкретной карточки
                btn.swiperInstance = new Swiper(sliderContainer, {
                    direction: 'vertical',
                    loop: true,
                    speed: 4000,
                    autoplay: {delay: 0, disableOnInteraction: false},
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    loopAddCards: 10,
                    allowTouchMove: true,
                    centeredSlides: false,
                    observer: true,
                    observeParents: true,
                });
            }
        } else {
            textBox.innerHTML = shortText;
            this.textContent = 'Про проєкт';
            if (second_item) second_item.style.gap = '78px';

            if (staticImg) staticImg.classList.remove('hidden');
            if (sliderContainer) sliderContainer.style.display = 'none';

            if (btn.swiperInstance) {
                btn.swiperInstance.destroy(true, true);
                btn.swiperInstance = null;
            }
        }
    });
});