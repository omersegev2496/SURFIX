import sessionService from "./services/sessionService.js";

document.addEventListener('DOMContentLoaded', async () => {
    const calendarElement = document.getElementById('calendar');
    const sessionCardContainer = document.querySelector('.session-card-container');
    
    const currentDate = new Date();
    let selectedDate = null;
    let sessions = [];

    await loadSessions();
    createCalendar(currentDate.getFullYear(), currentDate.getMonth());
    markDatesWithSessions(currentDate.getFullYear(), currentDate.getMonth() + 1);

    async function loadSessions(filters = "") {
        sessions = await sessionService.query(filters);
        displayAllSessions();
    }

    function createCalendar(year, month) {
        calendarElement.innerHTML = '';

        const calendarHeader = document.createElement('div');
        calendarHeader.classList.add('calendar-header');

        const monthSelect = document.createElement('select');
        const yearSelect = document.createElement('select');

        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = new Date(0, i).toLocaleString('default', { month: 'long' });
            if (i === month) option.selected = true;
            monthSelect.appendChild(option);
        }

        for (let i = 2020; i <= new Date().getFullYear(); i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            if (i === year) option.selected = true;
            yearSelect.appendChild(option);
        }

        calendarHeader.appendChild(monthSelect);
        calendarHeader.appendChild(yearSelect);
        calendarElement.appendChild(calendarHeader);

        const calendar = document.createElement('div');
        calendar.classList.add('calendar');

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const day = document.createElement('div');
            calendar.appendChild(day);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i;
            day.addEventListener('click', () => selectDate(year, month, i, day));
            calendar.appendChild(day);
        }

        calendarElement.appendChild(calendar);

        monthSelect.addEventListener('change', () => {
            createCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
            markDatesWithSessions(parseInt(yearSelect.value), parseInt(monthSelect.value) + 1);
        });
        yearSelect.addEventListener('change', () => {
            createCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
            markDatesWithSessions(parseInt(yearSelect.value), parseInt(monthSelect.value) + 1);
        });
    }

    function markDatesWithSessions(year, month) {
        const days = calendarElement.querySelectorAll('.day');
        days.forEach(day => {
            const dayText = day.textContent;
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayText).padStart(2, '0')}`;
            if (sessions.some(session => session.date === dateStr)) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                day.appendChild(dot);
            }
        });
    }

    function selectDate(year, month, day, element) {
        if (selectedDate) {
            selectedDate.classList.remove('selected');
        }
        selectedDate = element;
        selectedDate.classList.add('selected');
        const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        displaySessions(selectedDateStr);
    }

    function displaySessions(date = "") {
        sessionCardContainer.innerHTML = '';

        const filteredSessions = sessions.filter(session => session.date === date);

        filteredSessions.forEach(session => {
            const sessionCard = document.createElement('div');
            sessionCard.classList.add('session-card');

            sessionCard.innerHTML = `
                <div class="current-date">
                    <span class="current-date-value">${session.date}</span>
                </div>
                <div class="session-header">
                    <div class="session-title-col">
                        <span class="icon"><img src="./images/surfer-icon.png" alt=""></span>
                        <span class="session-title">${session.name}</span>
                    </div>
                    <div class="session-time-col">
                        <span class="session-time">${session.duration}</span>
                    </div>
                </div>
                <div class="session-details">
                    <div class="star-col">
                        <span class="star">★</span>
                        <span class="detail-value">${session.stars}</span>
                    </div>
                    <div class="side-col">
                        <div class="footer">
                            <span class="wave-icon"><img src="./images/wave-svgrepo-com.svg" alt=""> Left</span>
                            <span class="wave-value">${session.waveLeft}</span>
                        </div>
                    </div>
                </div>
                <div class="session-details2">
                    <div class="location-col">
                        <span class="location-icon"><img src="./images/location-icon.png" alt=""></span>
                        <span class="detail-value">${session.location}</span>
                    </div>
                    <div class="footer">
                        <span class="wave-icon"><img src="./images/wave-svgrepo-com.svg" alt=""> Right</span>
                        <span class="wave-value">${session.waveRight}</span>
                    </div>
                </div>
            `;

            sessionCard.addEventListener('click', () => {
                window.location.href = `session_page.html?sessionId=${session.sessionId}`;
            });

            sessionCardContainer.appendChild(sessionCard);
        });
    }

    function displayAllSessions() {
        sessionCardContainer.innerHTML = '';

        sessions.forEach(session => {
            const sessionCard = document.createElement('div');
            sessionCard.classList.add('session-card');

            sessionCard.innerHTML = `
                <div class="current-date">
                    <span class="current-date-value">${session.date}</span>
                </div>
                <div class="session-header">
                    <div class="session-title-col">
                        <span class="icon"><img src="./images/surfer-icon.png" alt=""></span>
                        <span class="session-title">${session.name}</span>
                    </div>
                    <div class="session-time-col">
                        <span class="session-time">${session.duration}</span>
                    </div>
                </div>
                <div class="session-details">
                    <div class="star-col">
                        <span class="star">★</span>
                        <span class="detail-value">${session.stars}</span>
                    </div>
                    <div class="side-col">
                        <div class="footer">
                            <span class="wave-icon"><img src="./images/wave-svgrepo-com.svg" alt=""> Left</span>
                            <span class="wave-value">${session.waveLeft}</span>
                        </div>
                    </div>
                </div>
                <div class="session-details2">
                    <div class="location-col">
                        <span class="location-icon"><img src="./images/location-icon.png" alt=""></span>
                        <span class="detail-value">${session.location}</span>
                    </div>
                    <div class="footer">
                        <span class="wave-icon"><img src="./images/wave-svgrepo-com.svg" alt=""> Right</span>
                        <span class="wave-value">${session.waveRight}</span>
                    </div>
                </div>
            `;

            sessionCard.addEventListener('click', () => {
                window.location.href = `session_page.html?sessionId=${session.sessionId}`;
            });

            sessionCardContainer.appendChild(sessionCard);
        });
    }

});
