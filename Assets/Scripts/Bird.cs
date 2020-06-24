using UnityEngine;
using UnityEngine.SceneManagement;


public class Bird : MonoBehaviour
{
    private bool isClicked = false;
    private Vector3 _initialPosition;
    private bool _birdWasLaunched;
    private float _timeSittingAround;
   
    [SerializeField] private float _lauchPower = 500;


    //Awake is used to initialize any variables or game state before the game starts.
    //Awake is called only once during the lifetime of the script instance. 
    private void Awake()
    {
        _initialPosition = transform.position;

    }

    private void Update()
    {

        GetComponent<LineRenderer>().SetPosition(1, _initialPosition);
                GetComponent<LineRenderer>().SetPosition(0, transform.position);


        if(_birdWasLaunched && GetComponent<Rigidbody2D>().velocity.magnitude <= 0.1)
        {
            _timeSittingAround += Time.deltaTime;
        }

        if (transform.position.y > 20|| 
            transform.position.y < -25 ||
            transform.position.x > 45 ||
            transform.position.x < -45 ||
            _timeSittingAround > 2)
        {
            string currentSceneName = SceneManager.GetActiveScene().name;
            SceneManager.LoadScene(currentSceneName);
        }
       
    }




    private void OnMouseDown()  //built in method called when mouse is clicked (this case bird gets red)
    {
        if(!isClicked)
        {
        GetComponent<SpriteRenderer>().color = Color.red; //GetComponent is built in method to 
                                                          //acces components inside unity
        GetComponent<LineRenderer>().enabled = true;
        }
    }

    private void OnMouseUp() // //built in method called when mouse is unclicked (this case bird gets white)
    {
        if(!isClicked)
        {
        GetComponent<SpriteRenderer>().color = Color.white;

        Vector2 dirictionToInitialPosition = _initialPosition - transform.position;
        GetComponent<Rigidbody2D>().AddForce(dirictionToInitialPosition * _lauchPower);
        GetComponent<Rigidbody2D>().gravityScale = 1;
        _birdWasLaunched = true;

        GetComponent<LineRenderer>().enabled = false;
        isClicked=true;
        }
    }

    private void OnMouseDrag() //OnMouseDrag is called when the user has clicked on a Collider and is still holding down the mouse.
                                //OnMouseDrag is called every frame while the mouse is down.
    {
        if(!isClicked)
        {
        Vector3 newPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        transform.position = new Vector3(newPosition.x, newPosition.y);
        }
    }
}