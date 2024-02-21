const url = './docs/pdf.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageisRendering = false;
    pageNumIsPending = null;


const scale = 1.5 , 
   canvas = document.querySelector('#pdf-render'),
   ctx = canvas.getContext('2d');


// render page 
const renderPage = num => {
    pageisRendering = true ; 
    pdfDoc.getPage(num).then(page =>{
      const viewport = page.getViewport({scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width; 

      const renderCtx = {
        canvasContext : ctx,
        viewport
      } 

      page.render(renderCtx).promise.then(() => {
        pageisRendering = false ; 

        if(pageNumIsPending !== null){
          renderPage(pageNumIsPending) ; 
          pageNumIsPending = null ; 
        }
      });

      // output the current page 
     
      document.getElementById('page-num').textContent = num ;


    });

}


const queueRenderPage = num => {
  if (pageisRendering ){
    pageNumIsPending = num ;
  }else{
    renderPage(num);
  }
}




// Show prev ans show next 

const showPrevPage = () => {
  if(pageNum  <=1 ){
    return
  }
  pageNum--;
  queueRenderPage(pageNum);
}

const showNextPage = () => {
  if(pageNum  >= pdfDoc.numPages){
    return
  }
  pageNum++;
  queueRenderPage(pageNum);
}

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    console.log(pdfDoc);

    document.querySelector('#page-count').textContent = pdfDoc.numPages ;

    renderPage(pageNum)
}) 
  .catch(err => {
    const div = document.createElement( 'div' );
    div.className='error';
    div.appendChild(document.createElement(err.message));
    document.querySelector('body').insertBefore(div,canvas);
    
  })


document.querySelector('#prev-page').addEventListener('click',showPrevPage);
document.querySelector('#next-page').addEventListener('click',showNextPage);