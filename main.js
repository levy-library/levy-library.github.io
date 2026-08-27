let currentrow = 0; //Set to a number to test that row from the TSV.
let filled = 0; //For filling the gallery images only once.
let data;
let whichpage;
let resume = 0;

function loaddata() {
	d3.tsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vSZRQUVSbORK7JDYsFto76BZDRVVB7wNBsM-MAMYTxbxhq009v1k-DcaNuQfARa8c3mOJlW0XltMnSw/pub?output=tsv").then(copythisdata => {
		data = copythisdata;
		filled = 0;
		currentrow = 0
		loadfromhash();
	});
}

function makehash(currentpermahash) { //Makes a hash out of the value given by the clicked HTML element.
	location.hash = currentpermahash;
}

function loadfromhash() { //Performs actions based around the number of the hash.	
	let hashname = location.hash.substring(1); //This removes the '#' from the hash referencer.
	let parsin = 0;
	while (parsin <= (data.length - 1) && (data[parsin].Permahash != hashname)) { parsin++; }
	currentrow = parsin;

	if (!filled) { //Populates the main gallery on the initial run.
		let gallery = document.getElementById("gallery");
		gallery.innerHTML = "";
		
		for (let i = 0; i <= (data.length - 1); i++) { //Check if the div styling is correct.
			let newdiv = document.createElement("a"); //Create div
			newdiv.setAttribute("id", "divnum" + i); //ID the div
			newdiv.setAttribute("class", "itemtile " + data[i].Category); //Class the div
			//newdiv.setAttribute("value", data[i].Genre);
			//newdiv.setAttribute("onclick", "makehash('" + data[i].Permahash + "')"); //Whole div makes clickable hash
			newdiv.setAttribute("href", "#" + data[i].Permahash);
			let imgG = document.createElement("IMG"); //Create image
			imgG.setAttribute("alt", data[i].Title);
			imgG.setAttribute("title", data[i].Title); //Tooltip
			//imgG.setAttribute("src", data[i].Thumb); 
			
			let thumby = data[i].URL;
			//Set the img to use the imgur link if that's what it's entered as (default action):
			if (thumby.includes("imgur")) { thumby = thumby.replace(".jpeg", "_d.webp?maxwidth=350"); }
			
			imgG.src = thumby;
			
			let textG = document.createElement("p"); //Create text
			textG.setAttribute("class", "childtext"); //Class the text
			textG.innerHTML = (data[i].Title);
			
			gallery.appendChild(newdiv);
			newdiv.appendChild(imgG);
			newdiv.appendChild(textG);
		}
		filled = 1;
	}
	//The above code populates the main page with the thumbnail images from the TSV if they haven't been loaded already. It even creates the HTML elements as well!
	//Infobox populating code below:
	if (location.hash != "") { // Removes error message on blank initial load.
		resume = 0;
		let media = document.getElementById("media");
		
		//Quickly clear the last thing before it slides in:
		media.src = "";
		document.querySelector("#infobox").removeAttribute("data-loaded");
		
		let boxtitle = data[currentrow].Title;
		
		if (data[currentrow].Extra) {
			boxtitle = `&ZeroWidthSpace;<a id="outlink" href="` + data[currentrow].Extra + `" target="_blank">` + boxtitle + `</a>`;
		}
		
		document.getElementById("title").innerHTML = boxtitle;
		document.getElementById("desc").innerHTML = data[currentrow].Info;
		
		media.src = data[currentrow].URL;
		media.alt = data[currentrow].Title;
		
		moveit();
	}
}

function fadebox() {
	document.querySelector("#infobox").setAttribute("data-loaded", "1");
}

document.addEventListener('keydown', function(event) {
	let info = document.getElementById('infobox');
	if (info.open && !resume) {
		const key = event.key;
		switch (event.key) {
			case "ArrowLeft": nextprev(0); break;
			case "ArrowRight": nextprev(1); break;
		}
	}
});

function nextprev(direction) {
	let gallery = document.getElementById("gallery");
	
	// Looking right:
	if (direction) {
		currentrow++;
		if (currentrow >= data.length) { currentrow = 0; }
		makehash(data[currentrow].Permahash);
	}
	// Looking left:
	else {
		currentrow--;
		if (currentrow < 0) { currentrow = data.length - 1; }
		makehash(data[currentrow].Permahash);
	}
}

function moveit() { document.getElementById('infobox').showModal(); }
function moveitout() { document.getElementById('infobox').close(); }

//Clicking off the info box removes the hash.
function closeit() {
	history.pushState("", document.title, window.location.pathname + window.location.search); //Removes the hash while maintaining stuff like search parameters. Just in case I add search functionality in the future.
	moveitout();
}

function swapitall(btn, path) {
	document.querySelector("#current").removeAttribute("id");
	btn.id = "current";
	
	//history.replaceState("", "", (window.location.origin + "/" + path))
	
	/*let fc = document.querySelector("#flexcontent");
	fc.style.opacity = 0;
	
	setTimeout(() => {
		fc.removeAttribute("style");
		replacecontent(path);
	}, 1000);*/
}

/*
let filters = document.getElementsByClassName("bullet");
let searchstring = location.hash.slice(location.hash.indexOf('?')).substring(1);
let itsasearch = 0;
let anysearches = 0;
if (searchstring !== "") { anysearches = 1; }
let found = 0; // Becomes 1 when the search matches a button.

function filter(item) {
	let searchquery;
	for (let i = 0; i < filters.length; i++) {
		filters[i].style.backgroundColor = "";
	}
	
	if (item !== "") { //If it's one of the buttons.
		searchquery = item.id;
	}
	else {
		searchquery = item.value;
		console.log(item.value);
		if (anysearches == 1) { item.parentElement.style.backgroundColor = "var(--pacific-blue)"; }
	}
	
	//searchquery = item.id;
	//item.style.backgroundColor = "var(--pacific-blue)";

	anysearches = 1;
	searchstring = searchquery.replace(/&amp;/g, '&');
	getfromsearch();
}

function getfromsearch() {
	if (anysearches == 1) {
		if (location.hash = hashname + '?' + searchstring) { location.hash = hashname + '?' + searchstring; }
		// ^ Prevents an infinite loop.
		
		// Cache the search bar text without leaving it out in the open.
		//let searchbartext = filters[2].children[0].value;
		//let cachedsearchbartext = searchbartext;
		
		// Fill the search bar with the content of the search, unless it belongs to one of the buttons:
		//Search bar = filters[2].
		found = 0;
		//if (filters[2].children[0].value === '') { //Blocking this clears searchbar.
			for (let i = 0; i < filters.length; i++) {
				if (filters[2].children[0].value === filters[i].id) {
					found = 1;
					filters[2].children[0].value = '';
					filters[i].style.backgroundColor = "var(--pacific-blue)";
					//filters[2].children[0].value = cachedsearchbartext;
					break;
				}
			if (found == 0 )
				{ filters[2].children[0].value = searchstring; }
			}
		//}
	}
}*/