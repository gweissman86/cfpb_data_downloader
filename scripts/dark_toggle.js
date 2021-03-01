// checks localStorage and activates previous theme
function checkTheme(){
    if (localStorage.getItem('theme') == 'dark'){
        darkTheme();
    } else {
        lightTheme();
    }
}   

// checks localStorage and switches themes
function switchTheme(){
    if (localStorage.getItem('theme') == 'dark'){
        lightTheme();
      } else if (localStorage.getItem('theme') == 'undefined' || localStorage.getItem('theme') == 'light'){
        darkTheme();
      } 
}

// remove dark theme css class
function lightTheme(){
    $("body").removeClass("dark-mode");
    localStorage.setItem('theme', 'light');
    console.log("light-theme");
}
// add dark theme css class
function darkTheme(){
    $("body").addClass("dark-mode");
    localStorage.setItem('theme', 'dark');
    console.log("dark-theme");
}
