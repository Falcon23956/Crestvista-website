
const PASSWORD = "CrestVista2025"; 
function loginAdmin(){
  let pass = document.getElementById('adminPass').value;
  if(pass === PASSWORD){
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    fetch('listings.json').then(r=>r.json()).then(d=>{
      document.getElementById('listingsEditor').value = JSON.stringify(d,null,2);
    });
  } else { alert('Wrong password'); }
}

function saveListings(){
  let newData = document.getElementById('listingsEditor').value;
  fetch('https://api.github.com/repos/Falcon23956/Crestvista-website/dispatches', {
    method:"POST",
    headers:{
      "Accept":"application/vnd.github+json",
      "Authorization":"Bearer "+localStorage.getItem("gh_token")
    },
    body: JSON.stringify({
      event_type:"update_listings",
      client_payload:{ listings:newData }
    })
  }).then(()=>alert('Update sent to GitHub Actions.'));
}
