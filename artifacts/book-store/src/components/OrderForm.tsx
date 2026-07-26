import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  useGetWilayas, 
  useGetCommunes, 
  useGetCenters, 
  useCreateOrder,
  getGetCommunesQueryKey,
  getGetCentersQueryKey
} from "@workspace/api-client-react"
import { BOOK_PRICE, getDeliveryPrice } from "@workspace/api-zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  firstname: z.string().min(1, "الاسم مطلوب"),
  familyname: z.string().min(1, "اللقب مطلوب"),
  contact_phone: z.string().regex(/^(\+?213\s*|0\s*)?\s*[5-7](\s*[0-9]){8}\s*$/, "رقم هاتف جزائري غير صالح (مثال: 0550123456 أو 0660123456 أو 0750123456)"),
  wilaya_id: z.string().min(1, "الولاية مطلوبة"),
  commune_id: z.string().min(1, "البلدية مطلوبة"),
  is_stopdesk: z.enum(["home", "stopdesk"]),
  address: z.string().optional(),
  stopdesk_id: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.is_stopdesk === "home" && (!data.address || data.address.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "عنوان التوصيل مطلوب",
      path: ["address"]
    })
  }
  if (data.is_stopdesk === "stopdesk" && (!data.stopdesk_id || data.stopdesk_id.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "يرجى اختيار مكتب التوصيل",
      path: ["stopdesk_id"]
    })
  }
})

type FormValues = z.infer<typeof formSchema>

interface OrderFormProps {
  onSuccess: (tracking: string, deliveryPrice: number) => void;
}

export function OrderForm({ onSuccess }: OrderFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      familyname: "",
      contact_phone: "",
      wilaya_id: "",
      commune_id: "",
      is_stopdesk: "home",
      address: "",
      stopdesk_id: ""
    }
  })

  const watchWilayaId = form.watch("wilaya_id")
  const watchIsStopdesk = form.watch("is_stopdesk")

  const { data: wilayas = [], isLoading: loadingWilayas } = useGetWilayas()
  const { data: communes = [], isLoading: loadingCommunes } = useGetCommunes(
    { wilaya_id: Number(watchWilayaId) },
    { query: { queryKey: getGetCommunesQueryKey({ wilaya_id: Number(watchWilayaId) }), enabled: !!watchWilayaId } }
  )
  const { data: centers = [], isLoading: loadingCenters } = useGetCenters(
    { wilaya_id: Number(watchWilayaId) },
    { query: { queryKey: getGetCentersQueryKey({ wilaya_id: Number(watchWilayaId) }), enabled: !!watchWilayaId && watchIsStopdesk === "stopdesk" } }
  )

  const createOrder = useCreateOrder()

  const [formError, setFormError] = React.useState<string | null>(null)
  const [pendingData, setPendingData] = React.useState<{ data: FormValues; deliveryPrice: number } | null>(null)
  const stopdeskSelectRef = React.useRef<HTMLButtonElement>(null)

  const selectedWilaya = wilayas.find(w => w.id === Number(watchWilayaId))
  const selectedCommune = communes.find(c => c.id === Number(form.watch("commune_id")))
  const selectedCenter = centers.find(c => c.center_id === Number(form.watch("stopdesk_id")))
  const isStopdesk = watchIsStopdesk === "stopdesk"
  const deliveryPrice = selectedWilaya ? getDeliveryPrice(selectedWilaya.name, isStopdesk) : 0
  const totalPrice = BOOK_PRICE + deliveryPrice

  const stopdeskInCommune = !selectedCenter || !selectedCommune || selectedCenter.commune_id === selectedCommune.id

  function submitOrder(data: FormValues, orderDeliveryPrice: number) {
    const wilaya = wilayas.find(w => w.id === Number(data.wilaya_id))
    const commune = communes.find(c => c.id === Number(data.commune_id))

    if (!wilaya || !commune) return

    createOrder.mutate({
      data: {
        firstname: data.firstname,
        familyname: data.familyname,
        contact_phone: data.contact_phone,
        to_wilaya_name: wilaya.name,
        to_commune_name: commune.name,
        is_stopdesk: data.is_stopdesk === "stopdesk",
        address: data.is_stopdesk === "home" ? data.address : null,
        stopdesk_id: data.is_stopdesk === "stopdesk" && data.stopdesk_id ? Number(data.stopdesk_id) : null,
        delivery_price: orderDeliveryPrice
      }
    }, {
      onSuccess: (res) => {
        if (res.success && res.tracking) {
          onSuccess(res.tracking, orderDeliveryPrice)
        } else {
          setFormError(res.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.")
        }
      },
      onError: () => {
        setFormError("تعذر إرسال الطلب. يرجى التحقق من اتصالك والمحاولة مجدداً.")
      }
    })
  }

  function onSubmit(data: FormValues) {
    setFormError(null)

    const wilaya = wilayas.find(w => w.id === Number(data.wilaya_id))
    const commune = communes.find(c => c.id === Number(data.commune_id))

    if (!wilaya || !commune) return

    const orderDeliveryPrice = getDeliveryPrice(wilaya.name, data.is_stopdesk === "stopdesk")

    const center = centers.find(c => c.center_id === Number(data.stopdesk_id))
    const centerNotInCommune = data.is_stopdesk === "stopdesk" && center && commune && center.commune_id !== commune.id

    if (centerNotInCommune) {
      setPendingData({ data, deliveryPrice: orderDeliveryPrice })
      return
    }

    submitOrder(data, orderDeliveryPrice)
  }

  function confirmStopDeskAnyway() {
    if (!pendingData) return
    submitOrder(pendingData.data, pendingData.deliveryPrice)
    setPendingData(null)
  }

  function changeStopDesk() {
    setPendingData(null)
    form.setValue("stopdesk_id", "")
    stopdeskSelectRef.current?.focus()
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-card rounded-md shadow-sm border border-card-border p-6 sm:p-10 relative overflow-hidden">
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-24 h-1 bg-primary" />

      <div className="mb-8">
        <h3 className="text-2xl font-serif text-foreground mb-2">استمارة الطلب</h3>
        <p className="text-muted-foreground text-sm font-sans">
          يرجى إدخال معلوماتك بدقة لضمان وصول الكتاب إليك.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded bg-destructive/10 text-destructive border border-destructive/20 text-sm">
          {formError}
        </div>
      )}

      {pendingData && (
        <div className="mb-6 p-4 rounded border border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100 dark:border-amber-900/50 text-sm">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">المكتب المختار لا يقع في بلديتك</p>
              <p className="opacity-90">
                بعض الزبائن يفضلون استلام طلباتهم من مكتب بعيد. إذا كنت تريد ذلك، يمكنك التأكيد. وإلا اختر مكتباً في بلديتك.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              onClick={changeStopDesk}
            >
              تغيير المكتب
            </Button>
            <Button
              type="button"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={confirmStopDeskAnyway}
            >
              تأكيد على أي حال
            </Button>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="الاسم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="familyname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اللقب</FormLabel>
                  <FormControl>
                    <Input placeholder="اللقب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input placeholder="05XX XX XX XX" dir="ltr" className="text-right" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="wilaya_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الولاية</FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val)
                    form.setValue("commune_id", "")
                    form.setValue("stopdesk_id", "")
                    setPendingData(null)
                  }} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingWilayas ? "جاري التحميل..." : "اختر الولاية"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wilayas.map(w => (
                        <SelectItem key={w.id} value={w.id.toString()}>
                          {w.id} - {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commune_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البلدية</FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val)
                    form.setValue("stopdesk_id", "")
                    setPendingData(null)
                  }} value={field.value} disabled={!watchWilayaId || loadingCommunes}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!watchWilayaId ? "اختر الولاية أولاً" : loadingCommunes ? "جاري التحميل..." : "اختر البلدية"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {communes.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_stopdesk"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>نوع التوصيل</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(val) => {
                      field.onChange(val)
                      form.setValue("stopdesk_id", "")
                      setPendingData(null)
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="home" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        توصيل للباب
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="stopdesk" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        سحب من مكتب (Stop Desk)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchIsStopdesk === "home" && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="animate-in fade-in slide-in-from-top-2">
                  <FormLabel>عنوان التوصيل (بالتفصيل)</FormLabel>
                  <FormControl>
                    <Input placeholder="الحي، الشارع، العمارة..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {watchIsStopdesk === "stopdesk" && (
            <FormField
              control={form.control}
              name="stopdesk_id"
              render={({ field }) => (
                <FormItem className={`animate-in fade-in slide-in-from-top-2 ${!stopdeskInCommune ? "border border-amber-300 rounded-md p-3 bg-amber-50/50 dark:bg-amber-950/20" : ""}`}>
                  <FormLabel>اختر المكتب</FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val)
                    setPendingData(null)
                  }} value={field.value} disabled={!watchWilayaId || loadingCenters}>
                    <FormControl>
                      <SelectTrigger ref={stopdeskSelectRef}>
                        <SelectValue placeholder={!watchWilayaId ? "اختر الولاية أولاً" : loadingCenters ? "جاري التحميل..." : "اختر المكتب الأقرب إليك"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {centers.length === 0 && watchWilayaId && !loadingCenters ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">لا تتوفر مكاتب في هذه الولاية</div>
                      ) : (
                        centers.map(c => (
                          <SelectItem key={c.center_id} value={c.center_id.toString()}>
                            {c.name} {c.commune_name ? `(${c.commune_name})` : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {!stopdeskInCommune && selectedCenter && selectedCommune && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      المكتب في {selectedCenter.commune_name} وليس في بلديتك ({selectedCommune.name})
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedWilaya && (
            <div className="p-4 rounded-md border border-border bg-muted/30 space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">سعر الكتاب</span>
                <span className="font-medium">{BOOK_PRICE.toLocaleString("ar-DZ")} د.ج</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">سعر التوصيل ({isStopdesk ? "مكتب" : "للمنزل"})</span>
                <span className="font-medium">{deliveryPrice.toLocaleString("ar-DZ")} د.ج</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-bold text-foreground">
                <span>المجموع</span>
                <span>{totalPrice.toLocaleString("ar-DZ")} د.ج</span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-serif tracking-wide bg-foreground text-background hover:bg-foreground/90 mt-8"
            disabled={createOrder.isPending || !!pendingData}
          >
            {createOrder.isPending ? "جاري الإرسال..." : `تأكيد الطلب — ${selectedWilaya ? totalPrice.toLocaleString("ar-DZ") : "1200"} د.ج`}
          </Button>

        </form>
      </Form>
    </div>
  )
}
