<style>
    /** Define the header rules **/
    .header {
        position: fixed;
        top: 0.5cm;
        left: 1cm;
        right: 1cm;
        height: 4cm;

    }

    /** Define the footer rules **/
    .footer {
        position: fixed;
        width: 100%;
        bottom: 0.2cm;
        left: -0.3cm;
        right: 1cm;
        height: 3cm;
    }

    .pagenum:before {
        content: counter(page);
    }

    #break {
        display:inline;
    }
    #break:after {
        content:"\a";
        white-space: pre;
    }

    .wd100, .wd-100 {
        width: 100%!important;
    }

    @page {
            margin: 10px 16px;
        }

        /** Define now the real margins of every page in the PDF **/
        body {
            margin-top: 2.9cm;
            margin-left: 1cm;
            margin-right: 1cm;
            margin-bottom: 2cm;
            /*font-size: 1.2em;*/
            font: 12pt/1.5 'Montserrat', sans-serif;
            font-weight: 350;
            background:  #fff;
            color: black;
            /*
                        -webkit-print-color-adjust:  exact;
            */
        }

</style>


<div class="header">
    <div style="margin-bottom: 30px !important;height: 80px;" >
        @php
            $imgentete = isset($data[0]['bl'], $data[0]['bl']['depot'], $data[0]['bl']['depot']['entete']) ? $data[0]['bl']['depot']['entete'] : asset("assets/media/logos/logo-texte.svg");
            $imgfooter = isset($data[0]['bl'], $data[0]['bl']['depot'], $data[0]['bl']['depot']['imagepied']) ? $data[0]['bl']['depot']['imagepied'] : asset("assets/media/logos/logo-texte.svg");
        @endphp
        
        @if(isset($data[0]['rubrique']))
         <img class="wd-100" style=";width:100%"  src="{{((isset($data) && count($data)) && array_key_exists('rubrique',$data[0]) && array_key_exists('entete',$data[0]['rubrique'])) ? $data[0]['rubrique']['entete'] : asset('assets/media/entete_pdf.jpg')}}" alt="">
        @else
            <img style="width: 170px" src='{{ $imgentete }}' alt="">
        @endif
        <hr>
    </div>
</div>
<div id="footer" class="footer mb-60">

    @if(isset($data[0]['rubrique']))
    <img style="margin-bottom: 30px !important;height: 80px;width:100%" class="wd100 hpx-90"  src="{{(isset($data) && count($data) && array_key_exists('rubrique',$data[0]) && array_key_exists('imagepied',$data[0]['rubrique'])) ? $data[0]['rubrique']['imagepied'] : asset('assets/media/pied_page.jpg')}}" alt="">
   @else
       <img class="wd-100" style="height: 100px;width:100%;margin-top:10px"  src="{{$imgfooter}}" alt="">
   @endif
</div>

