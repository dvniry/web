document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const calendar = document.getElementById('calendar');
    const today = new Date();
    let selectedStartDate = null;
    let selectedEndDate = null;

    dateInput.addEventListener('click', () => {
        calendar.style.display = calendar.style.display === 'none' ? 'block' : 'none';
    });

    function generateCalendar(year, month) {
        calendar.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'calendar-header';
        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        const title = document.createElement('span');
        title.textContent = `${today.toLocaleString('default', { month: 'long' })} ${year}`;
        header.appendChild(prevButton);
        header.appendChild(title);
        header.appendChild(nextButton);

        prevButton.addEventListener('click', () => {
            const newMonth = month === 0 ? 11 : month - 1;
            const newYear = month === 0 ? year - 1 : year;
            generateCalendar(newYear, newMonth);
        });

        nextButton.addEventListener('click', () => {
            const newMonth = month === 11 ? 0 : month + 1;
            const newYear = month === 11 ? year + 1 : year;
            generateCalendar(newYear, newMonth);
        });

        calendar.appendChild(header);

        const days = document.createElement('div');
        days.className = 'calendar-days';

        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
            const dayElem = document.createElement('div');
            dayElem.textContent = day;
            dayElem.style.fontWeight = 'bold';
            days.appendChild(dayElem);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i < (firstDay === 0 ? 7 : firstDay); i++) {
            days.appendChild(document.createElement('div'));
        }

        for (let date = 1; date <= lastDate; date++) {
            const dayElem = document.createElement('div');
            dayElem.textContent = date;

            const isToday =
                date === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            if (isToday) {
                dayElem.classList.add('current-date');
            }

            dayElem.addEventListener('click', () => {
                if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                    selectedStartDate = new Date(year, month, date);
                    selectedEndDate = null;
                    dateInput.value = formatDate(selectedStartDate);
                } else {
                    selectedEndDate = new Date(year, month, date);
                    dateInput.value = `${formatDate(selectedStartDate)} - ${formatDate(
                        selectedEndDate
                    )}`;
                    calendar.style.display = 'none';
                }

                updateSelectedDates();
            });

            days.appendChild(dayElem);
        }

        calendar.appendChild(days);
    }

    function formatDate(date) {
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${date.getFullYear()}`;
    }

    function updateSelectedDates() {
        const dayElements = document.querySelectorAll('.calendar-days div');
        dayElements.forEach(day => {
            day.classList.remove('selected-date');

            const date = parseInt(day.textContent, 10);
            if (
                selectedStartDate &&
                date === selectedStartDate.getDate() &&
                !selectedEndDate
            ) {
                day.classList.add('selected-date');
            }

            if (
                selectedEndDate &&
                date >= selectedStartDate.getDate() &&
                date <= selectedEndDate.getDate()
            ) {
                day.classList.add('selected-date');
            }
        });
    }

    generateCalendar(today.getFullYear(), today.getMonth());
});
