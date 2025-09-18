# Advanced Features FAQ

## What calculation methods does the app support?

### House Systems
- **Placidus** (default): Most popular modern system, unequal houses based on time
- **Whole Sign**: Ancient system with equal 30° houses starting from Ascendant
- **Equal House**: Equal houses starting from Ascendant degree
- **Koch**: Time-based system popular in Europe
- **Campanus**: Space-based system using great circles
- **Regiomontanus**: Medieval system based on celestial equator

### Zodiac Systems
- **Tropical** (default): Season-based, used in Western astrology
- **Sidereal**: Star-based, used in Vedic astrology
- **Ayanamsa options**: Lahiri, Krishnamurti, Raman (for sidereal calculations)

## How do I change my chart calculation settings?

### Accessing Settings
1. Go to your Profile tab
2. Tap on "Chart Preferences" or "Advanced Settings"
3. Select your preferred house system and zodiac type
4. Save changes - your chart will automatically recalculate

### When to Use Different Systems
- **Placidus**: General Western astrology, psychological interpretation
- **Whole Sign**: Traditional astrology, aspects and timing
- **Sidereal**: Vedic astrology, Indian traditions
- **Equal House**: When birth time is uncertain or for simplicity

## What are planetary aspects and how are they calculated?

### Major Aspects and Orbs
- **Conjunction (0°)**: ±8° orb for Sun/Moon, ±6° for other planets
- **Sextile (60°)**: ±4° orb
- **Square (90°)**: ±6° orb for Sun/Moon, ±4° for others
- **Trine (120°)**: ±6° orb for Sun/Moon, ±4° for others
- **Opposition (180°)**: ±8° orb for Sun/Moon, ±6° for others

### Minor Aspects (if enabled)
- **Semi-sextile (30°)**: ±2° orb
- **Semi-square (45°)**: ±2° orb
- **Sesquiquadrate (135°)**: ±2° orb
- **Quincunx (150°)**: ±3° orb

### Aspect Calculation
- Based on exact degrees between planets
- Applying vs. separating aspects (planet moving toward vs. away from exact)
- Mutual reception and dignities considered in interpretation

## How does the app handle retrograde planets?

### Retrograde Motion
- **Symbol**: ℞ appears next to retrograde planets
- **Calculation**: Based on apparent motion from Earth's perspective
- **Frequency**: Mercury 3-4x/year, Venus/Mars less frequently, outer planets annually

### Retrograde Meanings
- **Mercury**: Communication delays, technology issues, review and revision
- **Venus**: Relationship and financial reconsiderations
- **Mars**: Energy turned inward, delayed action
- **Outer planets**: Generational influences, internal transformation

## What coordinate systems does the app use?

### Geographic Coordinates
- **Decimal degrees**: Most precise format (e.g., 40.7128, -74.0060)
- **Degrees/minutes/seconds**: Traditional format (e.g., 40°42'46"N, 74°00'22"W)
- **Atlas data**: Comprehensive database of world cities and coordinates

### Time Zone Handling
- **Historical changes**: Automatic adjustment for past DST and time zone changes
- **GMT/UTC conversion**: All calculations performed in Universal Time
- **Local time display**: Results shown in birth location time

## How accurate are the astronomical calculations?

### Ephemeris Data
- **Swiss Ephemeris**: Industry-standard astronomical calculations
- **Accuracy**: Precise to seconds of arc for current era
- **Time range**: Accurate from 3000 BCE to 3000 CE
- **Updates**: Regular updates for leap seconds and astronomical corrections

### Precision Factors
- **Birth time**: Accuracy to nearest minute recommended
- **Location**: Coordinates precise to city level sufficient
- **Atmospheric effects**: Minimal impact on astrological calculations
- **Precession**: Automatically handled for sidereal calculations

## Can I compare my chart with others (synastry)?

### Current Limitations
- Single chart focus in current version
- Synastry features planned for future updates

### Workaround Solutions
- Take screenshots of each chart for manual comparison
- Note key planetary positions and signs
- Use external synastry resources with our calculated positions

## What about progressions and transits?

### Not Currently Supported
- Secondary progressions
- Solar arc directions
- Current transits
- Return charts (solar, lunar, etc.)

### Future Development
These features are planned for future updates based on user demand.

## How does the app handle different calendar systems?

### Gregorian Calendar (Default)
- Standard Western calendar system
- Automatic leap year calculations
- Accurate for dates after 1582

### Julian Calendar
- For historical dates before 1582
- Contact support for pre-1582 birth dates
- Manual correction may be needed

## Can I export my chart data?

### Current Export Options
- Screenshot capability
- Manual copying of planetary positions from table view

### Planned Export Features
- PDF chart reports
- CSV data export
- Integration with other astrology software

## What privacy measures protect my birth data?

### Data Security
- **Encryption**: All personal data encrypted in transit and storage
- **Local storage**: Birth information stored securely on device
- **Cloud sync**: Optional, encrypted backup to personal account
- **No sharing**: Birth data never shared with third parties

### Data Control
- **Deletion**: Remove all data through app settings
- **Portability**: Export your data on request
- **Minimal collection**: Only birth data needed for calculations

## How often is the app updated?

### Update Schedule
- **Bug fixes**: As needed for critical issues
- **Features**: Major updates every 2-3 months
- **Calculations**: Astronomical data updated annually
- **Compatibility**: iOS/Android updates as required

### What's Coming Next
- Synastry and composite charts
- Transit tracking
- Progressive chart options
- Enhanced interpretation features

## Technical specifications

### Supported Devices
- **iOS**: 14.0 and later
- **Android**: API level 24 (Android 7.0) and later
- **Storage**: 100MB minimum free space
- **Internet**: Required for initial setup and location lookup

### Performance
- **Chart generation**: Typically under 2 seconds
- **Zoom response**: 60fps smooth rendering
- **Memory usage**: Optimized for older devices
- **Battery impact**: Minimal when not actively calculating