    //Show the pop-up automatically when the page loads
    window.onload = function() {
      document.getElementById('popup').style.display = 'flex';
    };
    // Close the pop-up when the user clicks the close button
    document.querySelectorAll('.close-btn').forEach(button => {
      button.addEventListener('click', function() {
        document.getElementById('popup').style.display = 'none';
      });
   });
    // Handle "No thanks" link
    document.querySelector('.no-thanks').addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('popup').style.display = 'none';
    });
    
