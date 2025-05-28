import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CouponCard = ({ coupon }: any) => {
  return (
    <Card className="w-full h-[50vh] max-w-md rounded-2xl shadow-md overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {coupon.title}
            </h2>
            <p className="text-sm text-gray-600">{coupon.code}</p>
          </div>
          <img
            src={coupon.store.logo}
            alt={coupon.store.name}
            width={20}
            height={20}
            className="w-12 h-12 border-2 border-yellow-800  object-contain rounded-full shadow"
          />
        </div>

        <p className="text-gray-700 text-sm">{coupon.description}</p>
        <p className="text-gray-700 text-sm">
          Discount: <span className="font-semibold">{coupon.discount}</span>
        </p>

        <div className="flex gap-2 text-sm">
          {coupon.categories.map((cat: any) => (
            <span
              key={cat.id}
              className="px-2 py-1 rounded bg-yellow-100 text-yellow-700"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {coupon.barcodeUrl && (
            <img
              src={coupon.barcodeUrl}
              alt="Barcode"
              width={80}
              height={40}
              className="w-24 h-24 object-contain rounded-md shadow"
            />
          )}
          {coupon.qrCodeUrl && (
            <img
              src={coupon.qrCodeUrl}
              alt="QR Code"
              width={80}
              height={40}
              className="w-24 h-24 object-contain rounded-md shadow"
            />
          )}
        </div>

        <div className="text-xs text-gray-500">
          Valid from {new Date(coupon.startDate).toLocaleDateString()} to{" "}
          {new Date(coupon.endDate).toLocaleDateString()}
        </div>

        <div className="flex gap-2 text-xs">
          {coupon.isOnline ? (
            <span className="text-green-600">Online</span>
          ) : (
            <span className="text-red-600">Offline</span>
          )}
          {coupon.isInStore ? (
            <span className="text-blue-600">In-Store</span>
          ) : (
            <span className="text-red-600">Stock Out</span>
          )}
          {coupon.isPremium && <span className="text-red-600">Premium</span>}
        </div>
      </CardContent>
    </Card>
  );
};

const CouponList = ({
  coupons,
  pagination,
  onPageChange,
}: {
  coupons: any;
  pagination: any;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coupons.map((coupon: any) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <Button
          variant="outline"
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <div className="text-sm text-gray-600 translate-y-2">
          Page {pagination.page} of {pagination.totalPages}
        </div>
        <Button
          variant="outline"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CouponList;
