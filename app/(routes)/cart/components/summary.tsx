"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

const Summary = () => {
  const params = useParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [disabled, setDisabled] = useState(false);
  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const onCheckout = async (e: any) => {
    e.preventDefault();
    if ( items.length === 0 ) {
      setDisabled(true);
      toast.error("Product required")
      return;
    }
    setDisabled(true)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
        formData,
        totalPrice,
      },
    );
    
    //@ts-ignore
    window.snap.pay(response.data.transaction.token, {
      onSuccess : function() {
        toast.success("Payment completed.");
        setFormData({
          name: "",
          address : "",
          phone : "",
        })
        removeAll()
        setDisabled(false)
      },onError: function(){
        setDisabled(false)
        toast.error("Something wrong");
      },
      onPending : function() {
        setDisabled(false)
      },
    })
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = "process.env.CLIENT_KEY_MIDTRANS";

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <form className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-5">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="border w-full"
          />
          <Input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="border"
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="border"
          />
          
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order Total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button disabled={disabled} onClick={onCheckout} className="w-full mt-6">
        Check Out
      </Button>
    </form>
  );
};

export default Summary;
