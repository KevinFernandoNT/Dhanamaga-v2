import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { Block, Text } from "galio-framework";
import ValidationComponent from "react-native-form-validator";
import i18n from "i18n-js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Images, nowTheme } from "../constants";

import { Loader } from "../components";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getPoliciesDetails } from "../store/modules/policies/policies";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";
class TermsOfUse extends ValidationComponent {
  constructor(props) {
    super(props);
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
  }
  componentDidMount() {
    this.listnerr = this.props.navigation.addListener("focus", async () => {
      const language = await AsyncStorage.getItem("selectedLanguage");
      const getDisclaimer = {
        policyType: "tnc",
        language: language,
      };
      this.props.getPoliciesDetails(getDisclaimer);
    });
    this.forceUpdate();
  }
  render() {
    const { policies, policiesLoading } = this.props.policies;
    return (
      <ImageBackground
        source={Images.RegisterBackground}
        style={styles.profileContainer}
        imageStyle={styles.profileBackground}
      >
        <Loader show={policiesLoading} />
        <Block style={styles.subContanier}>
          <Text style={styles.policyTitle} color="#333" size={24}>
            {i18n.t("drawer_termsOfUse")}
          </Text>
          <ScrollView>
            <Block style={styles.policyContent}>
              <Text style={styles.policyContentText}>
                {policies ? policies.policies?.tnc : null}
              </Text>
            </Block>
          </ScrollView>
        </Block>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  subContanier: {
    flex: 1,
    backgroundColor: nowTheme.COLORS.WHITE,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  policyTitle: {
    fontFamily: "montserrat-regular",
    textAlign: "center",
    marginVertical: 20,
  },
  policyContent: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  policyContentText: {
    fontFamily: "montserrat-regular",
  },
  profileContainer: {
    flex: 1,
    padding: 0,
    zIndex: 1,
  },
});
function mapStateToProps(state) {
  return {
    messages: i18n.translations,
    deviceLocale: i18n.locale,
    policies: state.policies,
    language: state.language.languageSet,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPoliciesDetails,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
