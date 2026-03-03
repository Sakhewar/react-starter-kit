// resources/js/Pages/views/Unauthorized.tsx
export default function Unauthorized({ prefixepermission, page, requestData }: any) {
    return (
      <div className="flex items-center justify-center h-full text-center p-6">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
          {prefixepermission && (
            <p className="text-sm text-gray-500 mt-2">
              Permission requise : {prefixepermission}
            </p>
          )}
          {page && (
            <p className="text-sm text-gray-500 mt-1">
              Page demandée : 
            </p>
          )}
        </div>
      </div>
    );
  }