import { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { Appbar, Card, Divider, Text, List, IconButton, Portal, Dialog, SegmentedButtons, TextInput, Button } from "react-native-paper"
import { supabase } from "@/lib/supabase";

type Transaction = {
    id: string
    type: "in" | "out"
    amount: number
    description: string
    created_at: string
}

export default function Index() {
    const [dialogVisible, setDialogVisible] = useState(false)
    
    const [formAmount, setFormAmount] = useState("0")
    const [formDescription, setFormDescription] = useState("")
    const [formType, setFormType] = useState("out")
    const [transaction, setTransaction] = useState<Transaction[]>([])

    async function fetchData() {
        const { data, error } = await supabase
        .from("transcations")
        .select("*")
        .order("created_at", {ascending: false})

        if (error) {
            Alert.alert("Gagal mengambil transkasi", error.message)
        }

        setTransaction(data || [])
    }

    useEffect(()=> {
        fetchData()
    },[])

    async function handleAddTransaction() {
        if (!formAmount || !formDescription) {
            Alert.alert("Error", "Jumlah da Deskripsi harus diisi")
            return
        }

        const {error} = await supabase.from("transactions")
        .insert({
            amount: parseInt(formAmount),
            description: formDescription,
            type: formType,
        })

        if (error) {
            Alert.alert("Error", "Gagal menambahkan transaksi")
        }

    await fetchData()
    setDialogVisible(false)
    setFormAmount("0")
    setFormDescription("")
    setFormType("out")
    
}

    async function formatCurrency(amount: number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount)
    }

    


    return (
        <View>
            <Appbar.Header>
            <Appbar.Content title="Expense"/>
            <Appbar.Action icon="plus" onPress={() => {setDialogVisible(true)}}/>
            </Appbar.Header>

            <Card style={{ margin: 16 }}>
                <Card.Content>
                    <Text variant="labelSmall">Sisa Saldo</Text>
                    <Text variant="displaySmall" style={{ color: "green" }}>
                        Rp 1.000.000 
                    </Text>
                    <Divider style={{ marginVertical: 12 }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }} 
                    >
                        <View style={{alignItems: "center"}} >
                            <Text variant="labelSmall">Pemasukan</Text>
                            <Text variant="titleSmall" style={{ color: "green" }} >
                                Rp 1.500.000
                            </Text>
                        </View>
                        <View style={{alignItems: "center"}} >
                            <Text variant="labelSmall">Pengeluaran</Text>
                            <Text variant="titleSmall" style={{ color: "red" }} >
                                Rp 500.000
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <View style={{ marginHorizontal: 16 }} >

                <FlatList
                data={transaction}
                keyExtractor={(item) => item.id}
                renderItem={({item})=> (
                <List.Item
                title={item.description}
                description={new Date(item.created_at).toLocaleString}
                left={(props) => 
                <List.Icon
                icon={
                    item.type === "in" ? "arrow-up-circle" :
                    "arrow-down-circle"
                } 
                color={item.type === "in" ? "green" : "red"}
                />
                }
                right={()=> (
                    <View style={{ flexDirection: "row", alignItems: "center"}} >
                        <Text variant="labelLarge" 
                        style={{ color: item.type === "in" ? "green" : "red" }} >
                            {item.type === "in" ? "+" : "-"} 
                            {formatCurrency(item.amount)}
                        </Text>
                        <IconButton icon="delete-outline" onPress={()=> {}}/>
                    </View>
                )}
                />)}
                />
            </View>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={()=> {setDialogVisible(false)}}>
                    <Dialog.Title>Tambah Transaksi</Dialog.Title>
                    <Dialog.Content>
                        <SegmentedButtons
                        style={{ marginBottom: 16 }}
                        value={formType}
                        onValueChange={(v) => {setFormType(v)}}
                        buttons={[
                            {value: "in", label: "Pemasukan", icon: "arrow-up-circle", },
                            {value: "out", label: "Pengeluaran", icon: "arrow-down-circle", },
                        ]}
                        />

                        <TextInput 
                        label={"Jumalah (Rp)"}
                        keyboardType="numeric"
                        value={formAmount}
                        onChangeText={(v)=> {setFormAmount(v)}}
                        mode="outlined"
                        style={{ marginBottom: 16 }}
                        />

                        <TextInput 
                        label={"Deskripsi"}
                        value={formDescription}
                        onChangeText={(v)=> {setFormDescription(v)}}
                        mode="outlined"
                        />

                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=> {setDialogVisible(false)}}>Batal</Button>
                        <Button onPress={()=> {handleAddTransaction(    )}}>Simpan</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}