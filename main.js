// Model
let usersArray = [];
let nameList = [];
let previousWinners = [];

// Toggle dark mode
const darkModeButton = document.getElementById('darkModeButton');
const darkModeIcon = document.getElementById('darkModeIcon');
darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeIcon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

const soundDuration = 4000;

// Drum roll button
const drumRollButton = document.getElementById('drumRollButton');
drumRollButton.addEventListener('click', () => {
    chooseWinner('yes');
});

// Winner button
const winnerButton = document.getElementById('winnerButton');
winnerButton.addEventListener('click', () => {
    chooseWinner();
});

// Choose a winner
function chooseWinner(playAudio) {
    hideComment();

    if (nameList.length === 0) {
        alert("¡Pegue el listado de suscriptores en el campo proporcionado!");
    } else {
        const spinDuration = soundDuration;
        const intervalTime = 70;
        var spinTimes = 30;
        let i = 0;
        let number = 0;
        let winner = "";

        if (playAudio == 'yes') {
            spinTimes = Math.floor(spinDuration / intervalTime);
            const audio = new Audio('drum_roll_sound.mp3');
            audio.play();
        }

        const myInterval = setInterval(myWinnerDisplay, intervalTime);

        function myWinnerDisplay() {
            i++;
            if (i > spinTimes) {
                clearInterval(myInterval);
                displayComment();
            } else {
                do {
                    number = Math.floor(Math.random() * nameList.length);
                    winner = nameList[number];
                } while (previousWinners.includes(winner) && previousWinners.length < nameList.length);
                document.querySelector("#winner").innerText = winner;
            }
        }

        function displayComment() {
            const subscriptionDateISO = usersArray[number].Suscribe;
            const subscriptionDate = new Date(subscriptionDateISO);
            const readableDate = subscriptionDate.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });

            const subType = usersArray[number].SubType;
			const subTenure = usersArray[number].Tenure;
			const subNick = usersArray[number].Username;
            const subTypeText = subType === 'gift' ? "Es una sub regalada &#128000;" : "No es una sub regalada &#129297;";
			const subTenureText = subTenure === '1' ? "Lleva suscripto 1 mes" : "Lleva suscripto "+subTenure+" meses";

            document.querySelector("#winnerCommentLabel").style.display = "block";
            document.querySelector("#winnerComment").innerHTML = `
				&#42; Se suscribió el: ${readableDate}
				<br/>
				&#42; ${subTypeText}
				<br/>
				&#42; ${subTenureText}
				<br/>
				<button type="button" class="btn btn-danger mt-3" onclick="window.open('https://www.twitch.tv/popout/imicaelax/viewercard/${subNick}?popout=', '_blank')">VER MENSAJES</button>`;

            previousWinners.push(winner);
            console.log(`previousWinners = ${previousWinners}`);
        }
    }
}

function hideComment() {
    document.querySelector("#winnerCommentLabel").style.display = "none";
    document.querySelector("#winnerComment").textContent = "";
}

function hideWinner() {
    document.querySelector("#winner").textContent = "";
}

document.querySelector("#sendButton").addEventListener("click", () => {
    const inputValue = document.querySelector("#urlInput").value;
    hideWinner();
    hideComment();

    document.getElementById("loadingNameList").style.display = "block";

    const rows = inputValue.trim().split('\n');
    usersArray = rows.map(row => {
        const fields = row.split(',');
        if (fields.length !== 7) {
            console.warn(`Skipping invalid row: ${row}`);
            return null;
        }
        const [Username, Suscribe, CurrentTier, Tenure, Streak, SubType, Founder] = fields;
        return { Username, Suscribe, CurrentTier, Tenure, Streak, SubType, Founder };
    }).filter(user => user !== null); 

    nameList = usersArray.map(user => user.Username);
    const uniqueNameList = [...new Set(nameList)];

    document.querySelector("#nameList").innerHTML = "";
    document.querySelector("#nameTot").innerText = `Suscriptores:`;

    uniqueNameList.map(name => {
        const sp = document.createElement("span");
        sp.innerText = name;
        sp.classList.add("name-tag", "bg-primary", "text-white");
        document.querySelector("#nameList").appendChild(sp);
    });

    console.log(`nameTot = ${uniqueNameList.length}`);
    document.querySelector("#nameTot").innerText = `Suscriptores: ${uniqueNameList.length} en total`;

    document.getElementById("loadingNameList").style.display = "none";
});
