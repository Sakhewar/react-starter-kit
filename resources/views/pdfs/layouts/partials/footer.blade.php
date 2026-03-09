<!doctype html>
<html>
<head>

    <style>

        /** Define now the real margins of every page in the PDF **/

       /* @page  {
            margin: 0px 0px 100px;
        }*/

        /*.table {
            display: table;
            border-collapse: collapse;
            border: 1px  solid black;
            letter-spacing: 1px;
            font-size: 0.6rem;
            width: 100%;
        }*/


        /** Define now the real margins of every page in the PDF **/
        /*body {
            margin-top: 3.55cm;
            margin-left: 1cm;
            margin-right: 1.08cm;
            margin-bottom: 1cm;
            font: 12pt/1.5 'Montserrat', sans-serif;
            background:  #fff;
            color: black;
        }
*/

        /** Define the footer rules **/
        /*.footer {
            position: fixed;
            height: 2cm;
            margin-left: 1.0cm;
            margin-right: 1.0cm;
            margin-top: 5.0cm;
            !*margin-bottom: 1.0cm;*!
            bottom: -30px;
        }
        .mb-60 {
            margin-top: 60px;
        }*/


    </style>

</head>

@if(!isset($addToData['hidefooter']) || !$addToData['hidefooter'] )

@if(isset($addToData['footer']) && $addToData['footer'] == 'bl')
<div class="" style="margin-top: 0px; height: 20%;">

    <table class="table" style="margin-top:0px; position: absolute; bottom: 145px">
        <tr class="tr">
            <th class="th wd70">
                <center style="color: red; font-weight:bold; text-decoration: underline;">Client</center>
            </th>
            <th class="text-signature ps-1" rowspan="4">
                <center><i>Signature et Tampon</i></center>
            </th>
        </tr>
        <tr class="tr">
            <td class="td text-start fbold">Nom et prenom : </td>
        </tr>
        <tr class="tr">
            <td class="td text-start fbold">Poste dans l'entreprise :</td>
        </tr>
        <tr class="tr">
            <td class="td text-start fbold">Contact : </td>
        </tr>

    </table>


</div>
@elseif(isset($addToData['footer']) && $addToData['footer'] == 'facture')
<div class=" wd100" style="height: 20%;">
    <!--<div class="wd100" style="position: absolute; bottom: 110px">-->
    <div style="margin-top: 16px">
        <div class=" wd60" style="float: left; ">
            <span class="titre-text">Arrèter la présente facture proforma à la somme de </span>
            <div style="display:block; width:90%!important; margin-top:10px;">
                <span style="font-weight:bold; text-transform:uppercase; font-size:0.7em;">{{$sommeEnLettre}}</span>
            </div>

        </div>
        <div class="wd40" style="float: right; ">
            <div class="fbold" style="display: flex;">
                <div class="" style="text-align: left!important;  font-size: 15px;"> Montant Total HT : </div>
                <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire($total)}}</div>
            </div>

            <div class="fbold" style="display: flex;">
                <div class="" style="text-align: left!important; font-size: 15px;">
                @if($tva != null)
                Montant TVA ({{$pourcentTva}}%) :
                @else
                TVA ({{$pourcentTva}}%) Non facturé :
                @endif
                </div>
                @if($tva !== null)
                <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire($total_tva)}}</div>
                @else
                <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire((intval($total) * intval($pourcentTva)) / 100)}}</div>
                @endif
            </div>

            <!-- <div class="fbold" style="display: flex;">
                <div class="" style="text-align: left!important; font-size: 15px;">Montant AIRSI :</div>
                @if($airsi != null)
                <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire($total_airsi)}}</div>
                @else
                <div class="" style="text-align: right!important; font-size: 15px;">0.00</div>
                @endif
            </div> -->

            <div class="fbold" style="display: flex;">
                <div class="" style="text-align: left!important; font-size: 15px;">NET À PAYER :</div>
                <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire($total_ttc)}}</div>
            </div>
        </div>
    </div>

</div>

@endif
@if(isset($addToData['footer']) && $addToData['footer'] == 'proformas')
<!--<div class=" wd100" style="bottom: -20px; height: 38.5%; margin: 0px auto !important; padding-top: 0px !important;">


   <table class="table-proforma" >
		<tr>
            <td rowspan="2" style="padding: 0px; border: 0px; width: 60%">
				<table id="table-left" class="">
					<tr>
						<td id="titre" style="color: rgb(202, 10, 56)">VALIDATION / BON POUR ACCORD</td>
					</tr>
					<tr>
						<td>Nom et Prénom :</td>
					</tr>
					<tr>
						<td>Poste dans l'entreprise :</td>
					</tr>
					<tr>
						<td>Contact :</td>
					</tr>
					<tr style="height: 70px">
						<td id="signature"><i>Signature et Tampon</i></td>
					</tr>
				</table>
			</td>

		</tr>
		<tr>
			<td style="padding: 0px; border: 0px">
				<table style="" id="table-right" class="table-proforma">
					<tr class="montant">
						<td class="libelle-montant">Montant Total HT :</td>
						<td class="valeur-montant">{{Prix_en_monetaire($total)}}</td>
					</tr>
					<tr class="montant">
                        <td  class="libelle-montant"> Montant TVA :</td>
                        @if(Prix_en_monetaire($total_tva) != "0")
                            <td class="valeur-montant">{{Prix_en_monetaire($total_tva)}}</td>
                        @else
                            <td class="valeur-montant">0.00</td>
                        @endif
					</tr>

					<tr class="montant">
						<td  class="libelle-montant">Net   payer :</td>
						<td class="valeur-montant" style="color: rgb(2, 12, 126)">{{Prix_en_monetaire($total_ttc)}}</td>
                    </tr>

					<tr class="gras" >
						<td colspan="2" id="apres-montant">La présente proforma est valide un (01) mois   partir de sa date d'emission mentionnée.</td>
					</tr>
					<tr >
						<td colspan="2" id="apres-apres-montant"><span style="text-decoration: underline;"><b>TERMES DE PAIMENT :</b></span> <br/><br/>
                            @if($modalite_paiement)
                            {{$modalite_paiement["libelle"]}}
                            @endif
                        </td>
					</tr>
				</table>
			</td>

		</tr>


	</table>


</div>-->
@endif
@if(!isset($addToData['type']))
<div id="footer" class="footer mb-60">
  <img style="margin-top: 30px !important" class="wd100 hpx-90" src="{{ asset('assets/media/pied_page.jpg') }}" alt="">
</div>
@endif

@if(isset($addToData['footer']) && $addToData['footer'] == 'transfert_client')
<div class="wd40" style="float: right; ">
    <div class="fbold" style="display: flex;">
        <div class="" style="text-align: left!important; font-size: 15px;"> Montant Total : </div>
        <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire($total)}} </div>
    </div>
</div>
@endif

@if(isset($addToData['footer']) && $addToData['footer'] == 'factureachats')
{{-- <div class="wd40" style="float: right;position: absolute; bottom: -20px; height: 18.5%; margin: 0px auto !important; padding-top: 0px !important;">
    <div class="fbold" style="display: flex;">
        <div class="" style="text-align: left!important; font-size: 15px;"> Montant Total : </div>
        <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire($total)}} </div>
    </div>
</div> --}}
@endif

@if(isset($addToData['footer']) && $addToData['footer'] == 'commandes')
{{-- <div class="wd40"  style="float: right;position: absolute; bottom: -20px; height: 18.5%; margin: 0px auto !important; padding-top: 0px !important;">
    <div class="fbold" style="display: flex;">
        <div class="" style="text-align: left!important; font-size: 15px;"> Montant Total : </div>
        <div class="" style="text-align: right!important; font-size: 15px;">{{Prix_en_monetaire($total)}} </div>
    </div>
</div> --}}
@endif
@if(isset($addToData['footer']) && $addToData['footer'] == 'demandeprix')

@endif
@else
<p class="end-page text-end">
    Page <span class="pagenum"></span>
</p>
@endif

</html>

