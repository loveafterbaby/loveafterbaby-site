(function(){
  // Close the mobile menu after a link is tapped
  var menu=document.querySelector('details.menu');
  if(menu){
    menu.addEventListener('click',function(e){ if(e.target.closest('a')) menu.removeAttribute('open'); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') menu.removeAttribute('open'); });
    var mq=window.matchMedia('(min-width:960px)');
    function sync(){ if(mq.matches) menu.setAttribute('open',''); else menu.removeAttribute('open'); }
    sync(); if(mq.addEventListener) mq.addEventListener('change',sync);
  }
  // Waitlist: compose an email to Sheina (no server needed)
  var form=document.getElementById('waitlist-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=form.querySelector('#wl-name').value.trim();
      var email=form.querySelector('#wl-email').value.trim();
      var err=document.getElementById('wl-error');
      if(!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ err.hidden=false; return; }
      err.hidden=true;
      var subject='Love After Baby membership waitlist';
      var body='Hi Sheina,\n\nPlease add me to the Love After Baby membership waitlist.\n\nName: '+name+'\nEmail: '+email+'\n';
      var url='mailto:hello@loveafterbaby.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      form.setAttribute('data-mailto',url);
      window.location.href=url;
    });
  }
})();
