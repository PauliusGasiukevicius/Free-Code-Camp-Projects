let quotes = [
{
   text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
   author: "Helen Keller"
},
{
   text: "It is during our darkest moments that we must focus to see the light.",
   author: "Aristotle"
},
{
   text: "Find a place inside where there's joy, and the joy will burn out the pain.",
   author: "Joseph Campbell"
},
{
   text: "Grudges seldom hurt anyone except the one bearing them.",
   author: "Sherrilyn Kenyon"
},
{
   text: "Nothing is impossible, the word itself says 'I'm possible'!",
   author: "Audrey Hepburn"
},
{
   text: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
   author: "Robert Louis Stevenson"
},
{
   text: "Believe you can and you're halfway there.",
   author: "Theodore Roosevelt"
},
{
   text: "The only true wisdom is in knowing you know nothing.",
   author: "Socrates"
},
{
   text: "Life isn't about finding yourself. Life is about creating yourself.",
   author: "George Bernard Shaw"
},
{
   text: "Problems are not stop signs, they are guidelines.",
   author: "Robert H. Schuller"
}];


let newQuote = function()
{
	let idx = Math.floor(Math.random()*quotes.length);
	document.getElementById("text").innerHTML = '"' + quotes[idx].text + '"';
	document.getElementById("author").innerHTML = '- ' + quotes[idx].author;
	document.getElementById("tweet-quote").setAttribute("href","https://twitter.com/intent/tweet?text=" + 	document.getElementById("text").innerHTML + document.getElementById("author").innerHTML);
}