// Model
let usersArray = [];
let nameList = [];
let previousWinners = [];

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

// Function to fetch paste data from the URL
document.querySelector("#sendButton").addEventListener("click", () => {

    var pastebinUrl = "https://imicaelax.com.ar/api/get-donaciones.php?url=https://pastebin.com/raw/8dF9vtu5";

    hideWinner();

    document.getElementById("loadingNameList").style.display = "block";

    fetch(pastebinUrl)
        .then(response => response.text())
        .then(data => {
            try {

                const rows = JSON.parse(data);

                const filteredUsers = rows.filter(user => user.amount >= 2000);

                const usersGroupedByName = filteredUsers.reduce((acc, user) => {
                    if (!acc[user.name]) {
                        acc[user.name] = 0;
                    }
                    acc[user.name] += user.amount;
                    return acc;
                }, {});

                usersArray = Object.keys(usersGroupedByName).map(name => ({
                    name: name,
                    amount: usersGroupedByName[name]
                }));

                nameList = usersArray.map(user => user.name);
                const uniqueNameList = [...new Set(nameList)];

                document.querySelector("#nameList").innerHTML = "";
                document.querySelector("#nameTot").innerText = `Donantes:`;

                uniqueNameList.map(name => {
                    const sp = document.createElement("span");
                    sp.innerText = `${name} ($${usersGroupedByName[name]})`;
                    sp.classList.add("name-tag", "bg-primary", "text-white");
                    document.querySelector("#nameList").appendChild(sp);
                });

                console.log(`nameTot = ${uniqueNameList.length}`);
                document.querySelector("#nameTot").innerText = `Donantes: ${uniqueNameList.length} en total`;

                document.getElementById("loadingNameList").style.display = "none";
            } catch (error) {
                alert("Hubo un error al procesar los datos. Asegúrate de que el formato es correcto.");
                console.error(error);
                document.getElementById("loadingNameList").style.display = "none";
            }
        })
        .catch(error => {
            alert("Hubo un problema al obtener el contenido.");
            console.error(error);
            document.getElementById("loadingNameList").style.display = "none";
        });
});

// Choose a winner
function chooseWinner(playAudio) {

    if (nameList.length === 0) {
        alert("¡Cargue el listado de donantes primero!");
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
            const amount = usersArray[number].amount;
            const name = usersArray[number].name;

            previousWinners.push(winner);
            console.log(`previousWinners = ${previousWinners}`);
        }
    }
}

function hideWinner() {
    document.querySelector("#winner").textContent = "";
}
