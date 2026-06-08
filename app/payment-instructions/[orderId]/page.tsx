import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PaymentProofForm } from "@/components/payment/PaymentProofForm";
import { PayPalCheckoutButton } from "@/components/payment/PayPalCheckoutButton";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Payment Instructions | LUXORA Jewellery",
    description: "Payment instructions for your LUXORA jewellery order.",
};

type PaymentInstructionsPageProps = {
    params: Promise<{
        orderId: string;
    }>;
};

type PaymentOrder = {
    id: string;
    reference?: string | null;
    order_number?: string | null;
    order_type?: string | null;
    customer_user_id?: string | null;
    customer_email?: string | null;
    email?: string | null;
    customer_name?: string | null;
    total?: number | null;
    total_amount?: number | null;
    deposit_amount?: number | null;
    deposit_percentage?: number | null;
    payment_method?: string | null;
    payment_status?: string | null;
    status?: string | null;
    created_at: string;
};

function formatPrice(value?: number | null) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function prettyStatus(value?: string | null) {
    const cleanValue = String(value || "pending").replaceAll("_", " ");
    return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
}

function getOrderTotal(order: PaymentOrder) {
    return Number(order.total ?? order.total_amount ?? order.deposit_amount ?? 0);
}

function isDepositOrder(order: PaymentOrder) {
    return order.order_type === "quote_deposit";
}

export default async function PaymentInstructionsPage({
    params,
}: PaymentInstructionsPageProps) {
    const { orderId } = await params;

    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: order, error } = await supabaseAdmin
        .from("orders")
        .select(
            "id, reference, order_number, order_type, customer_user_id, customer_email, email, customer_name, total, total_amount, deposit_amount, deposit_percentage, payment_method, payment_status, status, created_at"
        )
        .eq("id", orderId)
        .single<PaymentOrder>();

    if (error || !order) {
        return (
            <main className="bg-[#fbf7ef] px-4 py-16">
                <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
                    <h1 className="text-4xl font-semibold text-neutral-950">
                        Order Not Found
                    </h1>

                    <p className="mt-4 leading-7 text-neutral-600">
                        We could not find this order.
                    </p>

                    <Link
                        href="/account"
                        className="mt-8 inline-block rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
                    >
                        Back To Account
                    </Link>
                </div>
            </main>
        );
    }

    const userEmail = user?.email || "";
    const orderEmail = order.customer_email || order.email || "";

    const isOwner =
        Boolean(user && order.customer_user_id === user.id) ||
        Boolean(userEmail && orderEmail.toLowerCase() === userEmail.toLowerCase());

    const reference = order.reference || order.order_number || order.id;
    const payableAmount = getOrderTotal(order);
    const alreadyPaid = order.payment_status === "paid";
    const canUploadProof = Boolean(user && isOwner);
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

    return (
        <main className="bg-[#fbf7ef]">
            <section className="border-b border-[#eadfca] bg-neutral-950 px-4 py-16 text-white">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
                        Payment Instructions
                    </p>

                    <h1 className="mt-4 text-5xl font-semibold">
                        Complete Your Payment
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-neutral-300">
                        Pay online with PayPal when available, or use manual payment
                        instructions and send proof for admin verification.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_420px]">
                <div className="space-y-8">
                    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
                        <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                            Order Summary
                        </p>

                        <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
                            {reference}
                        </h2>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <InfoBox title="Customer" value={order.customer_name || userEmail} />
                            <InfoBox title="Order Status" value={prettyStatus(order.status)} />
                            <InfoBox
                                title="Payment Status"
                                value={prettyStatus(order.payment_status)}
                            />
                            <InfoBox
                                title="Order Type"
                                value={isDepositOrder(order) ? "Quote Deposit" : "Checkout Order"}
                            />
                        </div>

                        <div className="mt-8 rounded-3xl bg-[#fbf7ef] p-6">
                            <p className="text-sm text-neutral-600">
                                {isDepositOrder(order)
                                    ? `Deposit Amount (${Number(
                                        order.deposit_percentage || 30
                                    )}%)`
                                    : "Payable Amount"}
                            </p>

                            <p className="mt-2 text-5xl font-semibold text-neutral-950">
                                {formatPrice(payableAmount)}
                            </p>
                        </div>

                        {alreadyPaid && (
                            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-700">
                                This order is already marked as paid. Thank you.
                            </div>
                        )}
                    </div>

                    <PayPalCheckoutButton
                        orderId={order.id}
                        reference={reference}
                        amount={payableAmount}
                        clientId={paypalClientId}
                        alreadyPaid={alreadyPaid}
                    />

                    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
                        <h2 className="text-3xl font-semibold text-neutral-950">
                            Bank Transfer Details
                        </h2>

                        <p className="mt-3 leading-7 text-neutral-600">
                            Use the confirmed payment account shared by LUXORA support.
                            Keep your order reference in the transfer note so admin can
                            match your payment quickly.
                        </p>

                        <div className="mt-6 grid gap-4">
                            <PaymentDetail label="Payment Method" value="Manual bank transfer / agreed payment method" />
                            <PaymentDetail label="Bank Name" value="Confirmed by LUXORA support" />
                            <PaymentDetail label="Account Title" value="LUXORA Jewellery" />
                            <PaymentDetail label="Account Number" value="Shared after order confirmation" />
                            <PaymentDetail label="IBAN" value="Shared when international transfer is needed" />
                            <PaymentDetail label="Currency" value="USD / PKR / AED" />
                            <PaymentDetail label="Payment Reference" value={reference} />
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
                        <h2 className="text-3xl font-semibold text-neutral-950">
                            After Payment
                        </h2>

                        <div className="mt-6 space-y-4 text-neutral-700">
                            <Step number="1" text="Send the exact payable amount using bank transfer or your agreed payment method." />
                            <Step number="2" text={`Use this order reference in payment note: ${reference}`} />
                            <Step number="3" text="Take screenshot or receipt of successful payment." />
                            <Step number="4" text="Send payment proof on WhatsApp with your order reference." />
                            <Step number="5" text="Admin will verify payment and update your payment status in your account." />
                        </div>
                    </div>
                    {canUploadProof ? (
                        <PaymentProofForm
                            orderId={order.id}
                            reference={reference}
                            alreadyPaid={alreadyPaid}
                        />
                    ) : (
                        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
                            <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                                Payment Proof
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
                                Login To Upload Proof
                            </h2>

                            <p className="mt-3 leading-7 text-neutral-600">
                                You can read the payment steps now. To upload payment
                                proof on the website, login with the same customer email
                                used for this order. You can also send proof on WhatsApp
                                with reference <strong>{reference}</strong>.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={`/account?next=/payment-instructions/${order.id}`}
                                    className="rounded-full bg-neutral-950 px-6 py-4 text-center text-sm font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
                                >
                                    Login To Upload Proof
                                </Link>

                                <Link
                                    href="/track-order"
                                    className="rounded-full border border-[#d6b46a] px-6 py-4 text-center text-sm font-semibold tracking-[0.16em] text-[#a77a25] uppercase hover:bg-[#fbf7ef]"
                                >
                                    Track Order
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="h-fit rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
                    <h2 className="text-3xl font-semibold text-neutral-950">
                        Need Help?
                    </h2>

                    <p className="mt-3 leading-7 text-neutral-600">
                        Contact support if you need payment confirmation, invoice details,
                        or international transfer guidance.
                    </p>

                    <div className="mt-6 space-y-3">
                        <a
                            href={`https://wa.me/0000000000?text=Hello%20LUXORA,%20I%20want%20to%20confirm%20payment%20for%20order%20${encodeURIComponent(
                                reference
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-full bg-[#a77a25] px-6 py-4 text-center text-sm font-semibold tracking-[0.16em] text-white uppercase hover:bg-neutral-950"
                        >
                            WhatsApp Support
                        </a>

                        <Link
                            href="/account"
                            className="block rounded-full border border-[#d6b46a] px-6 py-4 text-center text-sm font-semibold tracking-[0.16em] text-[#a77a25] uppercase hover:bg-[#fbf7ef]"
                        >
                            Back To Account
                        </Link>
                    </div>

                    <div className="mt-8 rounded-3xl bg-[#fbf7ef] p-5 text-sm leading-7 text-neutral-600">
                        <strong className="text-neutral-950">Important:</strong> Jewellery
                        prices can change because gold, diamond, and gemstone rates change.
                        Your confirmed quote/order amount should be paid within the agreed
                        validity time.
                    </div>
                </aside>
            </section>
        </main>
    );
}

function InfoBox({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-3xl bg-[#fbf7ef] p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#a77a25] uppercase">
                {title}
            </p>

            <p className="mt-2 font-semibold text-neutral-950">{value}</p>
        </div>
    );
}

function PaymentDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-[#eadfca] bg-[#fbf7ef] p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#a77a25] uppercase">
                {label}
            </p>

            <p className="mt-2 break-all font-semibold text-neutral-950">{value}</p>
        </div>
    );
}

function Step({ number, text }: { number: string; text: string }) {
    return (
        <div className="flex gap-4 rounded-2xl bg-[#fbf7ef] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                {number}
            </div>

            <p className="pt-1 text-sm leading-6">{text}</p>
        </div>
    );
}
