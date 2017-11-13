import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import CongressAPI from './CongressAPI';
import BillProgress from './BillProgress';
import NameHeader from './NameHeader';
import images from '../assets/images';

export default class BillDetail extends Component {
  static navigationOptions = {
    headerStyle: { backgroundColor: 'white' },
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { sponsor } = params.bill;
    let imageUrl = '';
    if ('facebook_id' in params.bill.sponsor) {
      const facebook_id = params.bill.sponsor.facebook_id;
      imageUrl = `https://graph.facebook.com/${facebook_id}/picture?type=large`;
    } else {
      imageUrl = params.bill.sponsor.picture_url;
    }
    this.state = {
      billExcerpts: '',
      sponsor: `${sponsor.first_name} ${sponsor.last_name} `,
      bill: params.bill,
      imageUrl: imageUrl,
      legId: '',
      personWasTapped: params.personWasTapped,
    };

    const legislatorId = params.bill.sponsor.id;
    CongressAPI.getLegislator(legislatorId)
      .then((response) => {
        this.setState({
          imageUrl: `https://graph.facebook.com/${response.facebook_account}/picture?type=large`,
          party: `(${response.current_party}-${response.roles[0].state})`,
          legId: response.member_id,
        });
      });


  }

  renderMachineSummary() {
    if (this.state.bill.machine_summary !== '') {
      return(
        <Text style={styles.summary}>
          {this.state.bill.machine_summary}
        </Text>
      );
    }
  }

  renderHumanSummary() {
    if (this.state.bill.human_summary !== '') {
      return(
        <Text style={styles.summary}>
          {this.state.bill.human_summary}
        </Text>
      );
    }
  }

  render() {
    const details = this.state.bill.title;
    const subject = this.state.bill.topic;
    const date = this.state.bill.introduction_date;
    const relativeDate = this.state.bill.last_updated;
    const sponsor = this.state.sponsor;
    return (
      <ScrollView
        style={styles.backgroundView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <NameHeader
          name={sponsor}
          imageUrl={this.state.imageUrl}
          party={this.state.party}
          wasTapped={this.state.personWasTapped}
          date={relativeDate}
          legId={this.state.legId}
          style={styles.header}
        />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            {details}
          </Text>
          <BillProgress style={styles.progressView} />
          {this.renderHumanSummary()}
          {this.renderMachineSummary()}
        </View>

        <View style={styles.divider} />
        <View style={styles.reactionView}>
          <Emoji image={images.smileyEmoji}/>
          <Emoji image={images.grinEmoji}/>
          <Emoji image={images.uhohEmoji}/>
          <Emoji image={images.sadEmoji}/>
          <Emoji image={images.angryEmoji}/>
        </View>
      </ScrollView>
    );
  }
}

export class Emoji extends Component {
  state = {
    isSelected: false,
  }
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <TouchableHighlight
        style={styles.highlight}
        underlayColor="white"
        onPress={() => this.setState({isSelected: !this.state.isSelected})}
      >
          <Image
            source={this.props.image}
            style={this.state.isSelected ? styles.selectedEmoji : styles.unselectedEmoji}
          />
      </TouchableHighlight>
    );
  }
}

BillDetail.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

let styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: '#CFD8DC',
    flex: 1,
    // backgroundColor: 'magenta',
  },
  scrollViewContent: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // backgroundColor: 'blue',
  },
  header: {
    marginTop: 7,
  },
  subject: {
    backgroundColor: 'white',
    // backgroundColor: 'purple',
    height: 15,
    fontSize: 13,
    fontFamily: 'OpenSans-Light',
    marginLeft: 15,
    marginTop: 14,
  },
  subjectWrapper: {
    backgroundColor: 'white',
    // backgroundColor: 'red',
    marginTop: 7,
  },
  title: {
    flex: -1,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 25,
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 30,
    // backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Regular',
    color: '#1F222A',
  },
  progressView: {
    marginBottom: 100,
  },
  date: {
    marginTop: 5,
    marginLeft: 15,
    fontSize: 14,
    color: 'grey',
    // backgroundColor: 'green',
  },
  nameView: {
    flexDirection: 'column',
    // backgroundColor: 'yellow',
  },
  sponsor: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'avenir-medium',
    // backgroundColor: 'green',
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 15,
    marginLeft: 15,
    // backgroundColor: 'blue',
    borderWidth: 0.5,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // backgroundColor: 'cyan',
  },
  summary: {
    flex: -1,
    // backgroundColor: 'orange',
    margin: 15,
    marginTop: 21,
    marginBottom: 28,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    lineHeight: 25,
    backgroundColor: 'white',
  },
  excerptsWrapper: {
    marginTop: 9,
    margin: 7,
    backgroundColor: 'white',

  },
  excerptsHeader: {
    // backgroundColor: 'red',
    flex: 1,
    fontFamily: 'OpenSans-Light',
    margin: 15,
    marginTop: 21,
    marginBottom: 0,
    fontSize: 17,
  },
  billExcerpts: {
    flex: -1,
    // backgroundColor: 'orange',
    margin: 15,
    marginTop: 0,
    fontFamily: 'OpenSans-Light',
    fontSize: 15,
  },
  reactionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 15,
  },
  unselectedEmoji: {
    resizeMode: 'contain',
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: 15,
    marginRight: 15,
  },
  selectedEmoji: {
    resizeMode: 'contain',
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#489AF0',
    borderRadius: 5,
  },
  highlight: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
    margin: 7,
  },
  divider: {
    height: 0.75,
    backgroundColor: '#CFD8DC',
    marginLeft: 15,
    marginRight: 15,
  },
  reactionLabel: {
    flex: 1
  }

});
