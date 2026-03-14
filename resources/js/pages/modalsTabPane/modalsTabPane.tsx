import * as TableShadCn from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { showToast, toCapitalize, useGlobalStore } from "@/hooks/backoffice";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

type PrixVenteRow = {
  point_vente_id: string | number;
  point_vente: any;
  prix_achat: string;
  frais: string;
  prix_revient: string;
  prix_vente: string;
};

type SeuilRow = {
    depot_id: string | number;
    depot: any;
    min: string;
    max: string;
  };

export function PrixVenteProduit({ type, data, setData }: { type: string, data:Record<string,any>, setData:Function })
{
    const {dataPage} = useGlobalStore();
    
    const tagInTabPane = "prix_ventes";

    const [rows, setRows] = useState<PrixVenteRow[]>([]);

    const columns = [
        { key: "point_vente", label: "Point de vente" },
        { key: "prix_achat",  label: "Prix d'achat" },
        { key: "frais",       label: "Frais" },
        { key: "prix_revient",label: "Prix de revient" },
        { key: "prix_vente",  label: "Prix de vente" },
    ];

    const editable_columns: (keyof PrixVenteRow)[] = [
        "prix_achat", "frais", "prix_revient", "prix_vente",
    ];

    useEffect(() =>
    {
        if(!data) return;
        if(!data.id)
        {
            if(!data[tagInTabPane]) data[tagInTabPane] = [];

            if (dataPage["pointventes"] && Array.isArray(dataPage["pointventes"]))
            {
                dataPage["pointventes"].sort((a,b) => a.id - b.id).forEach((pointvente: any) =>
                {
                    const alreadyExists = data[tagInTabPane].find((
                        item: PrixVenteRow) => item.point_vente_id === pointvente.id
                    );

                    if (!alreadyExists)
                    {
                        data[tagInTabPane].push(
                        {
                            point_vente_id: pointvente.id,
                            point_vente : pointvente,
                            prix_achat: "",
                            frais: "",
                            prix_revient: "",
                            prix_vente: "",
                        });
                    }
                });
            }
        } 
        setRows([...data[tagInTabPane]]);
    }, [dataPage, tagInTabPane]);
    
    const setValueInRow = (value: string, index: number, key: keyof PrixVenteRow) =>
    {
        const updated = [...rows];
        updated[index] = { ...updated[index], [key]: value };

        let val = parseFloat(value) || 0;
        if(isNaN(val)) val = 0;

        if(val < 0)
        {
            showToast(`${columns.find((col) => col.key === key)?.label} ne peut pas être négatif`, "error");
            return;
        }

        if (key === "prix_achat" || key === "frais")
        {
          const prixAchat = parseFloat(key === "prix_achat" ? value : updated[index].prix_achat) || 0;
          const frais     = parseFloat(key === "frais"      ? value : updated[index].frais)      || 0;
          const prixRevient = prixAchat + frais;

          updated[index].prix_revient = prixRevient > 0 ? (prixRevient).toString() : "";
        }

        data[tagInTabPane] = updated;
        setRows(updated);
    };

    return (
        <div className="flex flex-col gap-6">
        <div className="rounded-md overflow-hidden border border-border">
            <TableShadCn.Table>
            <TableShadCn.TableHeader>
                <TableShadCn.TableRow className="bg-black hover:bg-black">
                {columns.map((col) => (
                    <TableShadCn.TableHead
                    key={col.key + type}
                    className={cn("text-center text-white")}
                    >
                    {col.label}
                    </TableShadCn.TableHead>
                ))}
                </TableShadCn.TableRow>
            </TableShadCn.TableHeader>

            <TableShadCn.TableBody>
                {rows.map((row, i) => (
                <TableShadCn.TableRow key={i} className="">

                    
                    <TableShadCn.TableCell className="text-center">
                    {toCapitalize(row.point_vente?.libelle)}
                    </TableShadCn.TableCell>

                    
                    {editable_columns.map((key) => (
                    <TableShadCn.TableCell key={key + i} className="text-center tabpane">
                        <Input
                            type="number"
                            className=""
                            min={1}
                            autoComplete="off"
                            value={String(row[key] ?? "")}
                            onChange={(e) => setValueInRow(e.target.value, i, key)}
                        />
                    </TableShadCn.TableCell>
                    ))}

                </TableShadCn.TableRow>
                ))}
            </TableShadCn.TableBody>
            </TableShadCn.Table>
        </div>
        </div>
    );
}


export function SeuilProduit({ type, data, setData }: { type: string, data:Record<string,any>, setData:Function })
{
    const {dataPage} = useGlobalStore();
    
    const tagInTabPane = "seuils";

    const [rows, setRows] = useState<SeuilRow[]>([]);

    const columns = [
        { key: "depot",       label: "Dépôt" },
        { key: "min",         label: "Seuil Min" },
        { key: "max",         label: "Seuil Max" },
    ];

    const editable_columns: (keyof SeuilRow)[] = [
        "min", "max",
    ];

    useEffect(() =>
    {
        if(!data) return;
        if(!data[tagInTabPane]) data[tagInTabPane] = [];

        if (dataPage["depots"] && Array.isArray(dataPage["depots"]))
        {
            dataPage["depots"].sort((a,b) => a.id - b.id).forEach((depot: any) =>
            {
                const alreadyExists = data[tagInTabPane].find((
                    item: SeuilRow) => item.depot_id === depot.id
                );

                if (!alreadyExists)
                {
                    data[tagInTabPane].push(
                    {
                        depot_id: depot.id,
                        depot : depot,
                        min: "",
                        max: "",
                    });
                }
            });
        }

        setRows([...data[tagInTabPane]]);
    }, [dataPage, tagInTabPane]);


    const setValueInRow = (value: string, index: number, key: keyof SeuilRow) =>
    {
        const updated = [...rows];
        updated[index] = { ...updated[index], [key]: value };

        let val = parseFloat(value) || 0;
        if(isNaN(val)) val = 0;

        if(val < 0)
        {
            showToast(`${columns.find((col) => col.key === key)?.label} ne peut pas être négatif`, "error");
            return;
        }

        data[tagInTabPane] = updated;
        setRows(updated);
    };

    return (
        <div className="flex flex-col gap-6">
        <div className="rounded-md overflow-hidden border border-border">
            <TableShadCn.Table>
            <TableShadCn.TableHeader>
                <TableShadCn.TableRow className="bg-black hover:bg-black">
                {columns.map((col) => (
                    <TableShadCn.TableHead
                    key={col.key + type}
                    className={cn("text-center text-white")}
                    >
                    {col.label}
                    </TableShadCn.TableHead>
                ))}
                </TableShadCn.TableRow>
            </TableShadCn.TableHeader>

            <TableShadCn.TableBody>
                {rows.map((row, i) => (
                <TableShadCn.TableRow key={i} className="bg-white hover:bg-gray-100">

                    
                    <TableShadCn.TableCell className="text-center">
                    {toCapitalize(row.depot?.libelle)}
                    </TableShadCn.TableCell>

                    
                    {editable_columns.map((key) => (
                    <TableShadCn.TableCell key={key + i} className="text-center tabpane">
                        <Input
                            type="number"
                            className=""
                            min={1}
                            autoComplete="off"
                            value={String(row[key] ?? "")}
                            onChange={(e) => setValueInRow(e.target.value, i, key)}
                        />
                    </TableShadCn.TableCell>
                    ))}

                </TableShadCn.TableRow>
                ))}
            </TableShadCn.TableBody>
            </TableShadCn.Table>
        </div>
        </div>
    );
}