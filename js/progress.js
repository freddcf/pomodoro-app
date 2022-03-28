const circle = document.querySelector('.moving-outline_circle');
const circumference = circle.getTotalLength(); // Get the total length circumference of the circle

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circle;

// stroke-dasharray is like border-style, dashed but we can define the width os the dashes and eventually the gap between them

// style.strokeDashoffset is to decrease stroke-dasharraay and start reveal the shape

function setProgress(percent){
    // Set the progress to make our circle animated
    const progress = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = circumference - progress;
}