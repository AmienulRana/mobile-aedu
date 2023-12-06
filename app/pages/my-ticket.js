import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import BackHeader from "../components/common/back-header";
import { ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import useFetch from "../hooks/useFetch";
import COLORS from "../components/shared/COLORS";
import moment from "moment";
import { useLanguageContext } from "../context/LanguageContext";
import QRCode from "react-native-qrcode-svg";

export default function MyTicket() {
  const router = useRoute();
  const { data, fetchData } = useFetch(
    `/c_detail/${router?.params?.course_id}`
  );
  const { language } = useLanguageContext();

  const returnOrderDate = (date) => {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  };

  useEffect(() => {
    fetchData();
  }, [router]);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <ScrollView style={styles.container} showsHorizontalScrollIndicator={false}>
      <BackHeader />
      <View
        style={{
          flexDirection: "row",
          marginBottom: 6,
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <Text style={{ color: COLORS.main, fontWeight: "bold", fontSize: 18 }}>
          {"AEDU"}
        </Text>
        <Text
          style={{ fontSize: 14 }}
        >{`ORDER #${data?.ms_Payments?.[0]?.payment_id
          ?.replace(/-/g, "")
          ?.toUpperCase()
          ?.substring(0, 14)}`}</Text>
      </View>

      <View style={styles.wrapperTicket}>
        <View style={styles.infoContainer}>
          <View style={{ height: 150, width: "70%" }}>
            <Text style={styles.title}>{data?.title}</Text>
            <Text style={styles.text}>
              {language === "EN" ? "By" : "Dibuat Oleh"}{" "}
              {data?.ms_User?.ms_EnterpriseProfile?.business_name}
            </Text>
            <Text style={styles.text}>
              {data?.address},{" "}
              {moment(data?.start_date).format("DD MMMM YYYY HH:mm")} WIB
            </Text>
          </View>
          <View style={{ flex: 1, marginBottom: 8, marginRight: 16 }}>
            <QRCode
              value={`t.aedu.id/${data?.ms_Payments?.[0]?.payment_id}`}
              level="H"
              size={156}
            />
            <View style={styles.qrCodeTextContainer}>
              <Text style={styles.qrCodeText}>
                {language === "EN"
                  ? "*QR Code for entering bootcamp"
                  : "*QR Code untuk masuk bootcamp"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.eTicketContainer}>
          <Text style={styles.eTicketText}>E-TICKET</Text>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <View style={{ width: "100%" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {language === "EN" ? "Ticket Holder" : "Pemegang tiket"}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 1 }}>
            {`${data?.ms_Payments?.[0]?.ms_User?.ms_Profile?.first_name} ${data?.ms_Payments?.[0]?.ms_User?.ms_Profile?.last_name}`}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {`${data?.ms_Payments?.[0]?.ms_User?.ms_Profile?.phone} ${
              data?.ms_Payments?.[0]?.ms_User?.ms_Profile?.gmail ||
              data?.ms_Payments?.[0]?.ms_User?.ms_Profile?.email ||
              ""
            }`}
          </Text>
        </View>
        <View style={{ width: "100%", marginTop: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Order</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 1 }}>
            {data?.ms_Payments?.[0]?.payment_id
              ?.replace(/-/g, "")
              ?.toUpperCase()
              ?.substring(0, 14)}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {data?.ms_Payments?.[0]?.createdAt &&
              returnOrderDate(data?.ms_Payments?.[0]?.createdAt)}
          </Text>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 16, marginBottom: 4 }}>
        {language === 'EN' ? 'TERM & CONDITIONS FOR TICKET HOLDER' : 'SYARAT & KETENTUAN PEMEGANG TIKET'}
      </Text>
      <Text style={{ fontSize: 12, marginTop: 1, marginBottom:  20 }}>
        {language === 'EN' ? (
          <>
            This document contains private & confidential information including personal information, personal
            contact information, and any other information provided by{' '}
            <Text style={{ fontWeight: 'bold' }}>AEDU</Text> and requested by{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {data?.ms_User?.ms_EnterpriseProfile?.business_name}
            </Text>
            , the organizer of this event. The{' '}
            <Text style={{ fontWeight: 'bold' }}>
              QR Code (2 dimensional barcode), Order Number, REF (Reference Code) are secret,
            </Text>{' '}
            and that the ticket holder holds sole responsibility for the confidentiality of this code and
            personal information contained.
          </>
        ) : (
          <>
            Dokumen ini berisi informasi pribadi & rahasia termasuk informasi pribadi, informasi kontak
            pribadi, dan lainnya informasi yang diberikan oleh{' '}
            <Text style={{ fontWeight: 'bold' }}>AEDU</Text> dan diminta oleh{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {data?.ms_User?.ms_EnterpriseProfile?.business_name}
            </Text>
            , penyelenggara acara ini. Itu{' '}
            <Text style={{ fontWeight: 'bold' }}>
              Kode QR (barcode 2 dimensi), Nomor Pemesanan, REF (Referensi Kode) bersifat rahasia,
            </Text>{' '}
            dan bahwa pemegang tiket memikul tanggung jawab besar atas hal tersebut kerahasiaan kode ini dan
            informasi pribadi yang terkandung.
          </>
        )}
      </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    position: "relative",
  },
  wrapperTicket: {
    borderWidth: 1,
    borderColor: COLORS.main,
    borderRadius: 8,
    padding: 20,
    position: "relative",
    paddingBottom: 40,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    color: "gray",
  },
  qrCodeTextContainer: {
    paddingHorizontal: 1,
    marginTop: 2,
  },
  qrCodeText: {
    fontSize: 12,
  },
  eTicketContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.main,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  eTicketText: {
    color: "white",
    fontWeight: "bold",
  },
});
