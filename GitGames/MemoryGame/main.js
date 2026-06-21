let start = document.querySelector('.splash input[type= submit]');
let name = sessionStorage['name'];
let success = document.getElementById('true');
let fail = document.getElementById('false');
let duration = 2000;

const speed = document.getElementById('speed');
speed.addEventListener('change', () =>{
	duration = +speed.options[speed.selectedIndex].value;
});


start.addEventListener('click', function()  {
	if (!name){
		name = prompt("Please enter your name: ").trim();
		sessionStorage['name'] = name;
	}
	document.querySelector('.name span').textContent = name  || 'Guest';
	start.parentElement.remove()
});

// Function to shuffle the array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

// Get references to the parent container and its child blocks
const container = document.querySelector('.blocks-container');
const blocks = [...container.children];

// Shuffle the order of the blocks
shuffleArray(blocks);

// Clear the parent container
container.innerHTML = '';

// Append the shuffled blocks back to the parent container
blocks.forEach(block => container.appendChild(block));


let win = document.getElementById('splashScreen');

let flipped, counter = 0, misses = 0;
blocks.forEach(block => block.addEventListener('click', function (){
	block.classList.add('flip');
	if (flipped){
		counter++;
		blocks.forEach(block => block.classList.add('banned'));
			
		let n = block.getAttribute('data');
		if (n !== flipped.getAttribute('data')){
			setTimeout(function (){
				flipped.classList.remove('flip');
				block.classList.remove('flip');
				blocks.forEach(block => block.classList.remove('banned'));
				flipped = undefined;
			}, duration);

			document.querySelector('.tries span').textContent = ++misses;
			fail.play();
		}
		else{
			flipped.classList.add('success');
			block.classList.add('success');
			blocks.forEach(block => block.classList.remove('banned'));
			flipped = undefined;
			success.play();
		}
		document.querySelector('.accuracy').textContent = Math.round((counter - misses) / counter * 100);

		if (counter - misses === 10){
			win.style.display = 'block';
			setTimeout(function(){
				win.style.display = 'none';
			}, 2000);
		}
		
	}
	else{
		flipped = block;
		flipped.classList.add('banned');	
	}
}));







