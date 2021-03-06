import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, Grid, makeStyles } from '@material-ui/core';
import '../App.css';
import { useQuery, useMutation, gql} from '@apollo/client';
import queries from '../queries';
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '300px',
		width: '300px'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});
const Images = () => {

	const classes = useStyles();
	const [ imagesData, setImagesData ] = useState([]);
    const [pageNum,setPageNum] = useState(1);
    const [removeFromBin] = useMutation(queries.updateImage) 
   

    
	let card = null;
    
  function viewMore(){
    setPageNum(pageNum+1);
    refetch();
  }

  const { loading, error, data, refetch } = useQuery(queries.unsplash, {
    variables: { pageNum },
    fetchPolicy: 'cache-and-network'
  });
		

	const buildCard = (image) => {
        if(image.binned)
        {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={image.id}>
				<Card className={classes.card} variant='outlined'>
					
                    
						<button className="navlink" onClick={()=>{
                            removeFromBin({ variables: { 
                                id:image.id,
                                url:image.url, 
                                description:image.description,
                                 posterName:image.posterName,                       
                                 binned:false, 
                                 userPosted:image.userPosted,
                                 numBinned:image.numBinned
                                } })
                                 refetch()
                                 }}>
                                Remove From Bin</button>
							<img
								className={classes.media} src={image.url}
								title='image image'
								alt={image.posterName}
							/>

							<CardContent>
                <p>
									{image.description ? image.description : 'No Description'}
								</p>

                <p>
                  
									{image.posterName ? image.posterName : 'No Author'}
								</p>
							</CardContent>
					
				</Card>
			</Grid>
		);
        }
        else{
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={image.id}>
                    <Card className={classes.card} variant='outlined'>
                        
                            <button className="navlink" 
                            onClick={()=>{removeFromBin({ variables: { 
                                id:image.id,
                                url:image.url, 
                                description:image.description, 
                                posterName:image.posterName
                                ,binned:true, 
                                userPosted:image.userPosted,
                                numBinned:image.numBinned} 
                                })
                                refetch()
                                }}>Add to Bin</button> 
                                <img
                                    className={classes.media} src={image.url}
                                    title='image image'
                                    alt={image.posterName}
                                />
    
                                <CardContent>
                                    <p>
                                        {image.description ? image.description : 'No Description'}
                                    </p>
                                    <p>
                  
									{image.posterName ? image.posterName : 'No Author'}
								</p>
                                </CardContent>
                        
                    </Card>
                </Grid>
            );
        }
	};

if(!loading && data.unsplashImages)
{
  card = data.unsplashImages &&
  data.unsplashImages.map((image) => {
				return buildCard(image);
   });
}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
  else if(data.unsplashImages.length){

        return (
			<div>  
       <button className="navlink" onClick={viewMore}> View More </button>    <br></br> <br></br>
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
  }
	else {
		return (
			<div>
				<h2>No Images</h2>
			</div>
		);
	}
	
}
export default Images;
