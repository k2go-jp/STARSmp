/******************************************************************************/
/* k2go STARSmultiPanel                                                       */
/******************************************************************************/

/******************************************************************************/
/* window.load                                                                */
/******************************************************************************/
window.addEventListener("load", () =>
{
  for (const strApp in $Env.apps)
  {
    if ($Env.apps[strApp].display) K2goSTARSmultiPanel.addApp(strApp);
  }
});
document.addEventListener("DOMContentLoaded", () => {
/******************************************************************************/
/* btn-reload.click                                                           */
/******************************************************************************/
document.querySelector("#btn-reload").addEventListener("click", () =>
{
  window.location.reload();
});
/******************************************************************************/
/* btn-init.click                                                             */
/******************************************************************************/
document.querySelector("#btn-init").addEventListener("click", () =>
{
  for (const strApp in $Env.apps)
  {
    if ($Env.apps[strApp].display) K2goSTARSmultiPanel.layoutApp(strApp);
  }
});
/******************************************************************************/
/* add app events                                                             */
/******************************************************************************/
/*-----* open *--------------------------------------------------------------*/
document.querySelector("#btn-add").addEventListener("click", () =>
{
  const wrapper = document.querySelector("#add-app-wrapper");
  const ul      = document.querySelector("#add-app ul");

  wrapper.classList.add("active");
  ul     .innerHTML = "";

  for (const strApp in $Env.apps)
  {
    const app = $Env.apps[strApp];

    if (!app.display)
    {
      const li = document.createElement("li");

      li.textContent = app.title;
      li.setAttribute("app-id", strApp);

      ul.appendChild(li);
    }
  }
});
/*-----* select *-------------------------------------------------------------*/
document.querySelector("#add-app").addEventListener("click", (pEvent) =>
{
  pEvent.stopPropagation();
  if (pEvent.target.tagName === "LI") pEvent.target.classList.toggle("selected");
});
/*-----* submit *-------------------------------------------------------------*/
document.querySelector("#btn-submit").addEventListener("click", () => 
{
  const selectedApp = document.querySelectorAll("#add-app ul li.selected");

  selectedApp.forEach((pElement) =>
  {
    const strApp = pElement.getAttribute("app-id");
    const app    = $Env.apps[strApp];

    app.display = true;

    K2goSTARSmultiPanel.addApp       (strApp);
    K2goSTARSmultiPanel.foregroundApp(strApp);
  });

  document.querySelector("#add-app-wrapper").classList.remove("active");
});
/*-----* close *--------------------------------------------------------------*/
document.querySelector("#add-app-wrapper").addEventListener("click", (pEvent) =>
{
  pEvent.target.classList.remove("active");
});
/******************************************************************************/
/* div.window.drag                                                            */
/******************************************************************************/
/*-----* start *--------------------------------------------------------------*/
document.addEventListener("mousedown", (pEvent) =>
{
       if (pEvent.target.className === "header") document.querySelector("#lock").classList.add("move");
  else if (pEvent.target.className === "right" ) document.querySelector("#lock").classList.add("ew-resize");
  else if (pEvent.target.className === "footer") document.querySelector("#lock").classList.add("ns-resize");
  else if (pEvent.target.className === "resize") document.querySelector("#lock").classList.add("nwse-resize");
  else return;

  pEvent.preventDefault ();
  pEvent.stopPropagation();

  const $this           = pEvent.target.parentNode;
  const intHeaderHeight = document.querySelector("header").offsetHeight;
  const intLeft         = parseInt($this.style.left  , 10);
  const intTop          = parseInt($this.style.top   , 10);
  const intWidth        = parseInt($this.style.width , 10);
  const intHeight       = parseInt($this.style.height, 10);
  const intStartX       = pEvent.pageX;
  const intStartY       = pEvent.pageY;
  let   intMoveX        = intStartX;
  let   intMoveY        = intStartY;

  K2goSTARSmultiPanel.foregroundApp($this.getAttribute("id"));
/*-----* move *---------------------------------------------------------------*/
  const fncMove = (pEvent) =>
  {
    pEvent.preventDefault ();
    pEvent.stopPropagation();

    intMoveX = pEvent.pageX;
    intMoveY = pEvent.pageY;

    if (document.querySelector("#lock").classList.contains("move"))
    {
      $this.style.left = (intLeft + (intMoveX - intStartX)) + "px";
      $this.style.top  = (intTop  + (intMoveY - intStartY)) + "px";

      const objRect = $this.getBoundingClientRect();

      if (objRect.x + window.pageXOffset < 0              ) $this.style.left = "0px";
      if (objRect.y + window.pageYOffset < intHeaderHeight) $this.style.top  = "0px";
    }
    else if (document.querySelector("#lock").classList.contains("ew-resize"))
    {
      $this.style.width  = (intWidth  + (intMoveX - intStartX)) + "px";

      const objRect = $this.getBoundingClientRect();

      if (objRect.width < 400) $this.style.width  = "400px";
    }
    else if (document.querySelector("#lock").classList.contains("ns-resize"))
    {
      $this.style.height = (intHeight + (intMoveY - intStartY)) + "px";

      const objRect = $this.getBoundingClientRect();

      if (objRect.height < 400) $this.style.height = "400px";
    }
    else if (document.querySelector("#lock").classList.contains("nwse-resize"))
    {
      $this.style.width  = (intWidth  + (intMoveX - intStartX)) + "px";
      $this.style.height = (intHeight + (intMoveY - intStartY)) + "px";

      const objRect = $this.getBoundingClientRect();

      if (objRect.width  < 400) $this.style.width  = "400px";
      if (objRect.height < 400) $this.style.height = "400px";
    }    
  };

  document.addEventListener("mousemove", fncMove, { passive:false });
/*-----* end *----------------------------------------------------------------*/
  const fncEnd = () =>
  {
    pEvent.preventDefault ();
    pEvent.stopPropagation();

    document.removeEventListener("mousemove", fncMove, { passive:false });
    document.removeEventListener("mouseup"  , fncEnd);

    document.querySelector("#lock").classList.remove("move", "ew-resize", "ns-resize", "nwse-resize", "ns-resize-top");
  };

  document.addEventListener("mouseup", fncEnd);
});
/******************************************************************************/
/* sync.click                                                                 */
/******************************************************************************/
document.addEventListener("click", (pEvent) =>
{
/*-----* ui *-----------------------------------------------------------------*/
  if (pEvent.target.className !== "sync") return;

  pEvent.preventDefault ();
  pEvent.stopPropagation();

  const $this = pEvent.target.parentNode.parentNode;

  document.querySelectorAll(".window"                  ).forEach((pElement) => { pElement.classList.remove("sync", "select"); });
  document.querySelectorAll(".window > .header > .sync").forEach((pElement) => { pElement.style.pointerEvents = "none"; });

  $this.classList.add("sync", "select");
  K2goSTARSmultiPanel.foregroundApp($this.getAttribute("id"));
/*-----* sync apps *----------------------------------------------------------*/
  const fncSync = (pApp, pActiveApp) =>
  {
    document.querySelector(`#${pApp}`).classList.add("lock");

    K2goSTARSmultiPanel.waitReady(pApp).then(() =>
    {
      let intWaitTime = 0;

      $Env.apps[pApp].position = K2goSTARSmultiPanel.getPosition(pApp);

      if (K2goSTARSmultiPanel.isChangePosition(pApp, pActiveApp))
      {
        K2goSTARSmultiPanel.putLog(`change position ${pApp} ${JSON.stringify($Env.apps[pActiveApp].position)}`);
        $Env.apps[pApp].position = Object.assign({}, $Env.apps[pActiveApp].position);
        K2goSTARSmultiPanel.setPosition(pApp);
        intWaitTime = $Env.apps[pApp].waitTime;
      }

      setTimeout(() =>
      {
        K2goSTARSmultiPanel.waitReady(pApp).then(() =>
        {
          $Env.apps[pApp].dateInfo = K2goSTARSmultiPanel.getDateInfo(pApp);

          if (K2goSTARSmultiPanel.isChangeDateInfo(pApp, pActiveApp))
          {
            K2goSTARSmultiPanel.putLog(`change time ${pApp} {current:${K2goSTARSmultiPanel.formatDate(new Date($Env.apps[pActiveApp].dateInfo.currentDate), "%y/%mm/%dd %H:%M:%S")}, start:${K2goSTARSmultiPanel.formatDate(new Date($Env.apps[pActiveApp].dateInfo.startDate), "%y/%mm/%dd %H:%M:%S")}, end:${K2goSTARSmultiPanel.formatDate(new Date($Env.apps[pActiveApp].dateInfo.endDate), "%y/%mm/%dd %H:%M:%S")}, xScale:${$Env.apps[pActiveApp].dateInfo.xScale}}`);
            $Env.apps[pApp].dateInfo = Object.assign({}, $Env.apps[pActiveApp].dateInfo);
            K2goSTARSmultiPanel.setDateInfo(pApp, pActiveApp);
          }

          setTimeout(() =>
          {
            K2goSTARSmultiPanel.waitReady(pApp).then(() =>
            {
              document.querySelector(`#${pApp}`).classList.remove("lock");
            });
          }, 100);
        });
      }, intWaitTime);
    });
  };
/*-----* get active app info *------------------------------------------------*/
  const strActiveApp = $this.getAttribute("id");

  K2goSTARSmultiPanel.waitReady(strActiveApp).then(() =>
  {
    $Env.apps[strActiveApp].position = K2goSTARSmultiPanel.getPosition(strActiveApp);
    $Env.apps[strActiveApp].dateInfo = K2goSTARSmultiPanel.getDateInfo(strActiveApp);

    for (var strApp in $Env.apps)
    {
      if (strApp !== strActiveApp && $Env.apps[strApp].display && !document.querySelector(`#${strApp}`).classList.contains("lock"))
      {
        fncSync(strApp, strActiveApp);
      }
    }

    setTimeout(() =>
    {
      K2goSTARSmultiPanel.waitSyncing().then(() =>
      {
        document.querySelectorAll(".window > .header > .sync").forEach((pElement) => { pElement.style.pointerEvents = ""; });
        $this.classList.remove("sync");
      });
    }, 100);
  });
});
/******************************************************************************/
/* close.click                                                                */
/******************************************************************************/
document.addEventListener("click", (pEvent) =>
{
  if (pEvent.target.className !== "close") return;

  pEvent.preventDefault ();
  pEvent.stopPropagation();

  const $this = pEvent.target.parentNode.parentNode;

  $this.remove();
  $Env.apps[$this.getAttribute("id")].display = false;
});
});
